import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lightbulb, CheckCircle2, XCircle, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Question {
  id: string;
  level: number;
  question_text: string;
  question_type: string;
  correctAnswer: "option1" | "option2"; // matches backend
  explanation: string;
}

interface YesNoQuestionCardProps {
  question: Question;
  questionNumber: number;
  onAnswer: (answer: "option1" | "option2") => void;
  onNext: () => void;
  showHint?: boolean;
}

const YesNoQuestionCard = ({
  question,
  questionNumber,
  onAnswer,
  onNext,
  showHint = true,
}: YesNoQuestionCardProps) => {
  const [selectedOption, setSelectedOption] = useState<"yes" | "no" | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHintDialog, setShowHintDialog] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    let readyTimer: NodeJS.Timeout;

    if (isCorrect !== null) {
      // 1s delay to enable "Next" button
      readyTimer = setTimeout(() => setCanProceed(true), 1000);

      return () => {
        clearTimeout(readyTimer);
      };
    } else {
      setCanProceed(false);
    }
  }, [isCorrect]);

  const handleAnswer = (value: "yes" | "no") => {
    if (selectedOption) return; // Prevent multiple clicks

    const selectedOptionBackend: "option1" | "option2" = value === "yes" ? "option1" : "option2";

    setSelectedOption(value);
    onAnswer(selectedOptionBackend);

    const correct = selectedOptionBackend === question.correctAnswer;
    setIsCorrect(correct);
    setShowExplanation(true); // Always show explanation and "Next" button after selection
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setCanProceed(false);
    onNext();
  };

  const currentCorrectValue = question.correctAnswer === "option1" ? "yes" : "no";

  const getButtonStyle = (value: "yes" | "no") => {
    if (!selectedOption) {
      return "bg-gradient-card hover:bg-primary/10 border-primary/30 transition-all hover:scale-[1.02]";
    }

    // Highlight correct option (added hover:bg-success/10 to override default pink)
    if (value === currentCorrectValue) {
      return "bg-success/10 border-success text-success scale-[1.02] z-10 shadow-sm hover:bg-success/10 hover:text-success";
    }

    // Highlight selected wrong option (added hover:bg-destructive/10 to override default pink)
    if (selectedOption === value && value !== currentCorrectValue) {
      return "bg-destructive/10 border-destructive text-destructive scale-[1.02] hover:bg-destructive/10 hover:text-destructive";
    }

    return "bg-muted/5 opacity-40 cursor-not-allowed scale-[0.98] hover:bg-muted/5";
  };

  return (
    <>
      <Card className="p-5 sm:p-10 glass shadow-glow border-2 border-primary/20 animate-scale-in relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-6 sm:space-y-8 relative z-10">
          <div className="flex items-center justify-between gap-4">
            {showHint && !selectedOption ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHintDialog(true)}
                className="gap-2 h-9 px-3 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-full transition-bounce"
              >
                <Lightbulb className="w-4 h-4" />
                <span className="font-semibold">Hint</span>
              </Button>
            ) : <div className="w-20" />}

            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
              <span className="text-xs sm:text-sm font-bold text-primary tracking-wider uppercase">Level {question.level}</span>
            </div>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground leading-[1.2] tracking-tight">
              {question.question_text}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-2">
            {(["yes", "no"] as const).map((value) => (
              <Button
                key={value}
                size="lg"
                disabled={!!selectedOption}
                onClick={() => handleAnswer(value)}
                className={`h-16 sm:h-24 text-xl sm:text-3xl font-black rounded-2xl border-2 transition-all duration-300 ${getButtonStyle(
                  value
                )}`}
                variant="outline"
              >
                <div className="flex items-center justify-center w-full relative">
                  <div className="flex items-center gap-2">
                    <span>{value === "yes" ? "YES" : "NO"}</span>
                    {value === "yes" ? (
                      <Check className="w-5 h-5 sm:w-7 sm:h-7 stroke-[3]" />
                    ) : (
                      <X className="w-5 h-5 sm:w-7 sm:h-7 stroke-[3]" />
                    )}
                  </div>
                  {(selectedOption === value || (selectedOption && value === currentCorrectValue)) && (
                    <div className="absolute right-4 flex items-center">
                      {selectedOption === value ? (
                        isCorrect ? (
                          <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-success fill-success/10 stroke-[2.5]" />
                        ) : (
                          <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-destructive fill-destructive/10 stroke-[2.5]" />
                        )
                      ) : (
                        <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-success fill-success/10 stroke-[2.5]" />
                      )}
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>

          <div className="mt-4 sm:mt-8 min-h-[100px]">
            {showExplanation ? (
              <div className="p-4 sm:p-8 rounded-2xl border-2 border-primary/10 bg-primary/5 animate-slide-in-bottom shadow-sm">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className={`p-3 rounded-full ${isCorrect ? 'bg-success/10' : 'bg-destructive/10'}`}>
                    {isCorrect ? (
                      <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-success" />
                    ) : (
                      <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-destructive" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className={`text-xl sm:text-2xl font-black ${isCorrect ? 'text-success' : 'text-destructive'}`}>
                      {isCorrect ? "Correct! 🎉" : "Incorrect"}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium max-w-xl mx-auto">
                      {question.explanation}
                    </p>
                  </div>

                  <Button
                    onClick={handleNextQuestion}
                    disabled={!canProceed}
                    className="w-full max-w-sm mt-2 h-12 sm:h-14 text-lg font-bold rounded-xl shadow-glow active:scale-95 transition-transform disabled:opacity-50"
                  >
                    {canProceed ? "Next Question" : "Wait..."}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center border-2 border-dashed border-primary/10 rounded-2xl opacity-60">
                <p className="text-sm sm:text-base font-bold text-muted-foreground uppercase tracking-widest px-4">
                  Choose Yes or No to continue the game.
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Dialog open={showHintDialog} onOpenChange={setShowHintDialog}>
        <DialogContent className="max-w-[90vw] sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Lightbulb className="w-5 h-5 text-secondary" />
              Hint
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base pt-3 sm:pt-4 leading-relaxed">
              {question.explanation}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default YesNoQuestionCard;
