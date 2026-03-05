import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

interface QuitGameModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

const QuitGameModal = ({
    open,
    onOpenChange,
    onConfirm,
}: QuitGameModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[90vw] sm:max-w-md rounded-2xl p-6">
                <DialogHeader className="space-y-3">
                    <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
                        <XCircle className="w-6 h-6 text-destructive" />
                    </div>
                    <DialogTitle className="text-center text-xl font-bold">
                        Quit Game?
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        Are you sure you want to quit? Your current progress will be lost.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-row gap-3 sm:gap-0 mt-6">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex-1 h-11 border-2 font-semibold transition-smooth hover:bg-secondary/10"
                    >
                        Resume
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        className="flex-1 h-11 font-semibold shadow-md transition-bounce hover:scale-[1.02]"
                    >
                        Quit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default QuitGameModal;
