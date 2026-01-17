import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { NativeAudio } from "@capacitor-community/native-audio";

interface BackgroundMusicContextType {
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
    volume: number;
    setVolume: (volume: number) => void;
    pause: () => void;
    resume: () => void;
}

const BackgroundMusicContext = createContext<BackgroundMusicContextType | undefined>(undefined);

export const BackgroundMusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [enabled, setEnabled] = useState<boolean>(() => {
        return localStorage.getItem("bgMusicEnabled") === "false" ? false : true;
    });

    const [volume, setVolume] = useState<number>(() => {
        const saved = localStorage.getItem("bgMusicVolume");
        return saved ? Number(saved) : 1;
    });

    const [isReady, setIsReady] = useState(false);
    const [nativeLoaded, setNativeLoaded] = useState(false);
    const isPausedRef = useRef(false);
    const webAudioRef = useRef<HTMLAudioElement | null>(null);
    const ASSET_ID = "bgmusic";

    // Initialize Audio
    useEffect(() => {
        // Initialize Web Audio as fallback immediately
        webAudioRef.current = new Audio("/sounds/bg.mp3");
        webAudioRef.current.loop = true;
        webAudioRef.current.volume = volume;

        const initAudio = async () => {
            try {
                console.log("Initializing NativeAudio...");

                // Try to preload
                try {
                    await NativeAudio.preload({
                        assetId: ASSET_ID,
                        assetPath: "public/sounds/bg.mp3",
                        audioChannelNum: 1,
                        isUrl: false,
                    });
                    console.log("NativeAudio asset preloaded successfully.");
                } catch (preloadError: any) {
                    // Check if error is because asset already exists (common in hot reload/re-init)
                    if (preloadError?.message?.includes('Asset already exists') || preloadError?.message?.includes('already loaded')) {
                        console.log("NativeAudio asset already loaded, proceeding.");
                    } else {
                        throw preloadError;
                    }
                }

                await NativeAudio.setVolume({
                    assetId: ASSET_ID,
                    volume: volume,
                });

                setNativeLoaded(true);
                setIsReady(true);
            } catch (e) {
                console.warn("NativeAudio init failed, falling back to Web Audio", e);
                setNativeLoaded(false);
                setIsReady(true);
            }
        };

        initAudio();

        return () => {
            // Cleanup on unmount
            const cleanup = async () => {
                try {
                    await NativeAudio.stop({ assetId: ASSET_ID });
                    await NativeAudio.unload({ assetId: ASSET_ID });
                } catch { }
                webAudioRef.current?.pause();
            };
            cleanup();
        };
    }, []);

    // Handle Toggle (Enabled/Disabled) - Only runs when ready
    useEffect(() => {
        if (!isReady) return;

        localStorage.setItem("bgMusicEnabled", String(enabled));
        handleToggle(enabled);
    }, [enabled, isReady]);

    const handleToggle = async (shouldPlay: boolean) => {
        // If we are "paused" (e.g. app in background), don't start playing even if enabled is true
        // But if we are disabling it (shouldPlay = false), we must stop it regardless.
        if (isPausedRef.current && shouldPlay) return;

        if (nativeLoaded) {
            try {
                if (shouldPlay) {
                    // Stop first to ensure no double playback or weird states
                    try { await NativeAudio.stop({ assetId: ASSET_ID }); } catch { }

                    await NativeAudio.loop({ assetId: ASSET_ID });
                    await NativeAudio.setVolume({ assetId: ASSET_ID, volume: volume });
                } else {
                    await NativeAudio.stop({ assetId: ASSET_ID });
                }
            } catch (e) {
                console.error("NativeAudio toggle failed", e);
                // Fallback if native fails mid-session
                fallbackPlay(shouldPlay);
            }
        } else {
            fallbackPlay(shouldPlay);
        }
    };

    const fallbackPlay = (shouldPlay: boolean) => {
        if (shouldPlay) {
            webAudioRef.current?.play().catch((e) => console.warn("Web Audio play failed", e));
        } else {
            webAudioRef.current?.pause();
        }
    };

    // Handle Volume Change
    useEffect(() => {
        localStorage.setItem("bgMusicVolume", String(volume));
        if (!isPausedRef.current) {
            applyVolume(volume);
        }
    }, [volume]);

    const applyVolume = async (vol: number) => {
        if (nativeLoaded) {
            try {
                await NativeAudio.setVolume({
                    assetId: ASSET_ID,
                    volume: vol,
                });
            } catch {
                if (webAudioRef.current) {
                    webAudioRef.current.volume = vol;
                }
            }
        } else {
            if (webAudioRef.current) {
                webAudioRef.current.volume = vol;
            }
        }
    };

    const pause = useCallback(async () => {
        console.log("Pausing background music (App Background/Manual)");
        isPausedRef.current = true;

        if (nativeLoaded) {
            try {
                await NativeAudio.stop({ assetId: ASSET_ID });
            } catch { }
        } else {
            webAudioRef.current?.pause();
        }
    }, [nativeLoaded]);

    const resume = useCallback(async () => {
        console.log("Resuming background music (App Foreground)");
        isPausedRef.current = false;
        if (enabled) {
            if (nativeLoaded) {
                try {
                    // Ensure we restart the loop
                    try { await NativeAudio.stop({ assetId: ASSET_ID }); } catch { }
                    await NativeAudio.loop({ assetId: ASSET_ID });
                    await NativeAudio.setVolume({ assetId: ASSET_ID, volume: volume });
                } catch (e) {
                    console.error("Failed to resume native audio", e);
                    fallbackPlay(true);
                }
            } else {
                fallbackPlay(true);
            }
        }
    }, [enabled, volume, nativeLoaded]);

    // Handle App State Changes (Background/Foreground)
    useEffect(() => {
        const setupAppStateListener = async () => {
            const { App } = await import('@capacitor/app');

            App.addListener('appStateChange', ({ isActive }) => {
                console.log("App State Changed:", isActive ? "Active" : "Inactive");
                if (!isActive) {
                    // App went to background - pause music
                    pause();
                } else {
                    // App came to foreground - resume if enabled
                    resume();
                }
            });
        };

        setupAppStateListener();

        return () => {
            import('@capacitor/app').then(({ App }) => {
                App.removeAllListeners();
            });
        };
    }, [pause, resume]);

    return (
        <BackgroundMusicContext.Provider
            value={{
                enabled,
                setEnabled,
                volume,
                setVolume,
                pause,
                resume,
            }}
        >
            {children}
        </BackgroundMusicContext.Provider>
    );
};

export const useBackgroundMusicContext = () => {
    const context = useContext(BackgroundMusicContext);
    if (context === undefined) {
        throw new Error("useBackgroundMusicContext must be used within a BackgroundMusicProvider");
    }
    return context;
};
