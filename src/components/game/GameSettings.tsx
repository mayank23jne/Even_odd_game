import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, Volume2, Music, Clock, X } from "lucide-react";
// import { useBGMusic } from "@/hooks/bgmusic";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useBGMusicStore } from "@/store/useBGMusicStore";

const GameSettings = ({ onChange }) => {
    const enabled = useBGMusicStore(state => state.enabled);
    const volume = useBGMusicStore(state => state.volume);
    const setEnabled = useBGMusicStore(state => state.setEnabled);
    const setVolume = useBGMusicStore(state => state.setVolume);
    const [gameDuration, setGameDuration] = useState<number>(() => {
        const saved = localStorage.getItem("gameDuration");
        return saved ? Number(saved) : 60;
    });

    useEffect(() => {
        onChange(gameDuration);
        localStorage.setItem("gameDuration", String(gameDuration));
    }, [gameDuration]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-4 right-4 rounded-full hover:text-dark w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 border-white/40 backdrop-blur-md shadow-lg transition-all duration-300 hover:rotate-90 z-50  bg-gradient-to-br from-primary/10 via-background to-accent/10"
                >
                    <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] max-w-[90vw] p-0 border-2 border-primary/20 rounded-[2rem] shadow-glow overflow-hidden [&>button]:hidden">
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/50 to-accent/10 -z-10" />

                {/* Header */}
                <div className="relative pt-5 pb-3 px-6 text-center">
                    <h2 className="text-3xl font-bold text-foreground tracking-wide drop-shadow-sm flex items-center justify-center gap-2">
                        <Settings className="w-6 h-6 text-primary" />
                        Settings
                    </h2>
                    <div className="absolute top-4 right-4">
                        <DialogClose asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </DialogClose>
                    </div>
                </div>

                {/* Separator */}
                <div className="w-[85%] border-t border-primary/20 mx-auto mb-4" />

                <div className="px-6 pb-8 space-y-6">
                    {/* Settings Container */}
                    <div className="bg-gradient-card rounded-2xl p-5 space-y-6 border border-primary/10 shadow-sm">
                        {/* Music Toggle */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Music className="w-5 h-5 text-primary" />
                                <span className="text-foreground font-bold text-lg">Music</span>
                            </div>
                            <CustomSwitch checked={enabled} onCheckedChange={setEnabled} />
                        </div>

                        {/* Volume Slider */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Volume2 className="w-5 h-5 text-primary" />
                                    <span className="text-foreground font-bold text-lg">Volume</span>
                                </div>
                                <span className="text-sm font-bold text-primary">{Math.round(volume * 100)}%</span>
                            </div>
                            <Slider
                                value={[volume]}
                                max={1}
                                step={0.1}
                                onValueChange={(vals) => setVolume(vals[0])}
                                disabled={!enabled}
                                className="cursor-pointer"
                            />
                        </div>

                        {/* Game Duration Slider */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <span className="text-foreground font-bold text-lg">Duration</span>
                                </div>
                                <span className="text-sm font-bold text-primary">{gameDuration}s</span>
                            </div>
                            <Slider
                                value={[gameDuration]}
                                min={30}
                                max={180}
                                step={10}
                                onValueChange={(vals) => setGameDuration(vals[0])}
                                className="cursor-pointer"
                            />
                            <p className="text-xs text-muted-foreground text-center font-medium">
                                Changes apply to next game
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const CustomSwitch = ({ checked, onCheckedChange }: { checked: boolean, onCheckedChange: (c: boolean) => void }) => (
    <div
        className={cn(
            "relative w-14 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300",
            checked ? "bg-primary" : "bg-muted"
        )}
        onClick={() => onCheckedChange(!checked)}
    >
        <div
            className={cn(
                "absolute top-1 bottom-1 w-5 bg-white rounded-full shadow-sm transition-all duration-300",
                checked ? "left-[calc(100%-1.25rem-0.25rem)]" : "left-1"
            )}
        />
    </div>
);

export default GameSettings;
