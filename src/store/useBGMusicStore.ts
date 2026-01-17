import { create } from 'zustand';
import { NativeAudio } from '@capacitor-community/native-audio';
import { Capacitor } from '@capacitor/core';

interface BGMusicState {
    enabled: boolean;
    volume: number;
    isPaused: boolean;
    isInitialized: boolean;
    isPlaying: boolean;
    isNative: boolean;
    webAudio: HTMLAudioElement | null;

    // Actions
    initialize: () => Promise<void>;
    cleanup: () => Promise<void>;
    setEnabled: (enabled: boolean) => Promise<void>;
    setVolume: (volume: number) => Promise<void>;
    pause: () => Promise<void>;
    resume: () => Promise<void>;
    startMusic: () => Promise<void>;
}

export const useBGMusicStore = create<BGMusicState>((set, get) => ({
    enabled: true,
    volume: 1,
    isPaused: false,
    isInitialized: false,
    isPlaying: false,
    isNative: false,
    webAudio: null,

    initialize: async () => {
        const state = get();

        if (state.isInitialized) return;

        const isNativePlatform = Capacitor.isNativePlatform();

        console.log('🎵 Initializing BGMusic...', { isNativePlatform });

        // Web Audio setup (fallback)
        const audio = new Audio('/sounds/bg.mp3');
        audio.loop = true;
        audio.volume = state.volume;
        audio.load();

        set({ webAudio: audio });

        if (isNativePlatform) {
            // Native Audio setup (Mobile)
            try {
                await NativeAudio.preload({
                    assetId: 'bgmusic',
                    assetPath: 'sounds/bg.mp3',
                    audioChannelNum: 1,
                    isUrl: false,
                });

                console.log('✅ Native Audio preloaded');
                set({ isNative: true, isInitialized: true });
            } catch (error) {
                console.log('❌ Native Audio preload failed:', error);
                set({ isNative: false, isInitialized: true });
            }
        } else {
            // Browser
            set({ isNative: false, isInitialized: true });
        }

        console.log('✅ BGMusic initialized', {
            isNative: get().isNative,
            enabled: get().enabled
        });
    },

    startMusic: async () => {
        const state = get();

        if (state.isPlaying || !state.enabled || !state.isInitialized) {
            console.log('⏭️ Skip start:', {
                isPlaying: state.isPlaying,
                enabled: state.enabled,
                isInitialized: state.isInitialized
            });
            return;
        }

        console.log('▶️ Starting music...');

        if (state.isNative) {
            // Native Audio
            try {
                await NativeAudio.setVolume({
                    assetId: 'bgmusic',
                    volume: state.volume,
                });

                await NativeAudio.loop({ assetId: 'bgmusic' });

                set({ isPlaying: true });
                console.log('✅ Music started (Native)', { volume: state.volume });
            } catch (error) {
                console.log('❌ Native start failed:', error);
            }
        } else {
            // Web Audio
            try {
                state.webAudio!.volume = state.volume;
                await state.webAudio!.play();
                set({ isPlaying: true });
                console.log('✅ Music started (Web)', { volume: state.volume });
            } catch (error) {
                console.log('❌ Web Audio start failed:', error);
            }
        }
    },

    cleanup: async () => {
        const state = get();

        console.log('🧹 Cleaning up...');

        if (state.isNative) {
            try {
                await NativeAudio.stop({ assetId: 'bgmusic' });
                await NativeAudio.unload({ assetId: 'bgmusic' });
            } catch (error) {
                console.log('Native cleanup error:', error);
            }
        }

        if (state.webAudio) {
            state.webAudio.pause();
            state.webAudio.currentTime = 0;
            state.webAudio.src = '';
        }

        set({
            isInitialized: false,
            isPlaying: false,
            isPaused: false,
            webAudio: null
        });
    },

    setEnabled: async (enabled: boolean) => {
        const state = get();

        console.log('🎚️ setEnabled:', enabled, {
            current: state.enabled,
            isPaused: state.isPaused,
            isPlaying: state.isPlaying
        });

        set({ enabled });

        // Agar paused hai, sirf state update karo
        if (state.isPaused) {
            console.log('⏸️ Paused, only updating state');
            return;
        }

        if (state.isNative) {
            // ===== NATIVE AUDIO =====
            try {
                if (enabled) {
                    // Set volume first, then start
                    await NativeAudio.setVolume({
                        assetId: 'bgmusic',
                        volume: state.volume,
                    });

                    await NativeAudio.loop({ assetId: 'bgmusic' });
                    set({ isPlaying: true });
                    console.log('✅ Native ON', { volume: state.volume });
                } else {
                    await NativeAudio.stop({ assetId: 'bgmusic' });
                    set({ isPlaying: false });
                    console.log('⏹️ Native OFF');
                }
            } catch (error) {
                console.log('❌ Native toggle error:', error);
            }
        } else {
            // ===== WEB AUDIO =====
            if (state.webAudio) {
                if (enabled) {
                    try {
                        state.webAudio.volume = state.volume;
                        await state.webAudio.play();
                        set({ isPlaying: true });
                        console.log('✅ Web Audio ON', { volume: state.volume });
                    } catch (error) {
                        console.log('❌ Web Audio play error:', error);
                    }
                } else {
                    state.webAudio.pause();
                    set({ isPlaying: false });
                    console.log('⏹️ Web Audio OFF');
                }
            }
        }
    },

    setVolume: async (volume: number) => {
        const state = get();

        console.log('🔊 setVolume:', volume, {
            current: state.volume,
            isPaused: state.isPaused,
            isPlaying: state.isPlaying,
            enabled: state.enabled
        });

        set({ volume });

        // Agar paused hai ya enabled nahi hai, sirf state update karo
        if (state.isPaused || !state.enabled) {
            console.log('⏸️ Paused or disabled, volume saved for later');
            return;
        }

        if (state.isNative) {
            // ===== NATIVE AUDIO =====
            try {
                await NativeAudio.setVolume({
                    assetId: 'bgmusic',
                    volume: volume,
                });
                console.log('✅ Native volume updated:', volume);
            } catch (error) {
                console.log('❌ Native volume error:', error);
            }
        } else {
            // ===== WEB AUDIO =====
            if (state.webAudio) {
                state.webAudio.volume = volume;
                console.log('✅ Web Audio volume updated:', volume);
            }
        }
    },

    pause: async () => {
        const state = get();

        console.log('⏸️ Pausing music...', {
            isPlaying: state.isPlaying,
            enabled: state.enabled
        });

        set({ isPaused: true });

        // Agar music chal raha hai, tab hi pause karo
        if (!state.isPlaying) {
            console.log('⏭️ Not playing, skip pause');
            return;
        }

        if (state.isNative) {
            // Native Audio ko temporarily mute karo (stop mat karo)
            try {
                await NativeAudio.setVolume({
                    assetId: 'bgmusic',
                    volume: 0,
                });
                console.log('✅ Native paused (muted)');
            } catch (error) {
                console.log('❌ Native pause error:', error);
            }
        } else {
            // Web Audio
            if (state.webAudio) {
                state.webAudio.volume = 0;
                console.log('✅ Web Audio paused (muted)');
            }
        }
    },

    resume: async () => {
        const state = get();

        console.log('▶️ Resuming music...', {
            isPaused: state.isPaused,
            enabled: state.enabled,
            volume: state.volume
        });

        set({ isPaused: false });

        // Agar enabled nahi hai, sirf state update karo
        if (!state.enabled) {
            console.log('🔇 Not enabled, skip resume');
            return;
        }

        if (state.isNative) {
            // Native Audio ko unmute karo
            try {
                await NativeAudio.setVolume({
                    assetId: 'bgmusic',
                    volume: state.volume,
                });
                console.log('✅ Native resumed', { volume: state.volume });
            } catch (error) {
                console.log('❌ Native resume error:', error);
            }
        } else {
            // Web Audio
            if (state.webAudio) {
                state.webAudio.volume = state.volume;
                console.log('✅ Web Audio resumed', { volume: state.volume });
            }
        }
    },
}));