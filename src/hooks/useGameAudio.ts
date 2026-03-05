import { useEffect, useCallback } from 'react';
import { NativeAudio } from '@capacitor-community/native-audio';

export const useGameAudio = () => {
    useEffect(() => {
        const preloadAudio = async () => {
            const sounds = {
                correct: "public/sounds/correct.mp3",
                wrong: "public/sounds/wrong.mp3",
                levelup: "public/sounds/level-up.mp3",
                gameover: "public/sounds/game-over.mp3",
                gamewon: "public/sounds/celebration.mp3",
            };

            try {
                // Use Promise.all to load all sounds in parallel
                await Promise.all(Object.entries(sounds).map(async ([key, url]) => {
                    try {
                        await NativeAudio.preload({
                            assetId: key,
                            assetPath: url,
                            audioChannelNum: 1,
                            isUrl: false,
                        });
                    } catch (err: any) {
                        // Ignore "Asset already exists" errors
                        if (err?.message?.includes('Asset already exists') || err?.message?.includes('already loaded')) {
                            return;
                        }
                        console.warn(`❌ Preload Error for ${key}:`, err);
                    }
                }));
            } catch (err) {
                console.log("❌ General Preload Error:", err);
            }
        };

        preloadAudio();

        return () => {
            // Optional: Decide if we really want to unload. 
            // If the game component unmounts/remounts often, unloading might be wasteful.
            // But to be safe and clean, we unload.
            const sounds = ["correct", "wrong", "levelup", "gameover", "gamewon"];
            sounds.forEach(id => {
                NativeAudio.unload({ assetId: id }).catch(() => { });
            });
        };
    }, []);

    const playSound = useCallback(async (soundName: 'correct' | 'wrong' | 'levelup' | 'gameover' | 'gamewon') => {
        try {
            await NativeAudio.play({ assetId: soundName });
            // Set volume right after starting play if not done during preload
            await NativeAudio.setVolume({ assetId: soundName, volume: 0.4 });
        } catch (err) {
            console.log(`❌ NativeAudio ${soundName} Error:`, err);
            // Web fallback
            const webAudioMap = {
                correct: '/sounds/correct.mp3',
                wrong: '/sounds/wrong.mp3',
                levelup: '/sounds/level-up.mp3',
                gameover: '/sounds/game-over.mp3',
                gamewon: '/sounds/celebration.mp3',
            };

            try {
                const audio = new Audio(webAudioMap[soundName]);
                audio.volume = 0.4;
                audio.currentTime = 0;
                audio.play().catch(e => console.warn("Web Audio play failed", e));
            } catch (webErr) {
                console.log(`❌ Web ${soundName} Audio Error:`, webErr);
            }
        }
    }, []);

    return { playSound };
};
