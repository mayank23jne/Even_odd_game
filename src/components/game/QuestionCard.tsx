import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lightbulb, CheckCircle2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Option {
  option: string;
  value: string;
}

interface Question {
  id: string;
  level: number;
  question_text: string;
  options: Option[];
  correctAnswer: string; // should match option.value
  explanation: string;
  hint?: string;
}

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  onAnswer: (selectedOption: string) => void;
  onNext: () => void;
  showHint?: boolean;
}

const QuestionCard = ({
  question,
  questionNumber,
  onAnswer,
  onNext,
  showHint = true,
}: QuestionCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
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

  const handleOptionClick = (optionKey: string) => {
    // Agar already correct answer mil gaya, tab kuch mat karo
    if (selectedOption === question.correctAnswer) return;

    setSelectedOption(optionKey);
    onAnswer(optionKey);

    const correct = optionKey === question.correctAnswer;
    setIsCorrect(correct);

    // Explanation show only on correct as per user request (or proper logic)
    if (correct) {
      setShowExplanation(true);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setCanProceed(false);
    onNext();
  };

  const isImageOption = (value: string) =>
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value) || value.startsWith("http");

  const getOptionClassName = (optionKey: string) => {
    if (!selectedOption) {
      return "bg-gradient-card hover:bg-primary/10";
    }

    if (selectedOption === question.correctAnswer) {
      if (optionKey === question.correctAnswer) {
        return "bg-gradient-to-r from-success/20 to-success/10 border-success";
      }
      return "bg-muted/50 opacity-50 cursor-not-allowed";
    }

    if (optionKey === selectedOption) {
      return "bg-gradient-to-r from-destructive/20 to-destructive/10 border-destructive";
    }

    return "bg-gradient-card hover:bg-primary/10";
  };

  return (
    <>
      <Card className="p-4 sm:p-6 md:p-8 glass shadow-glow border-2 border-primary/20 animate-scale-in">
        <div className="space-y-4 sm:space-y-6 flex flex-col justify-around">
          <div className="flex items-center justify-between gap-2">
            {showHint && !selectedOption && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHintDialog(true)}
                className="gap-1.5 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm transition-bounce hover:scale-105"
              >
                <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Hint</span>
              </Button>
            )}
            <div className="inline-block bg-gradient-to-r from-secondary/10 to-accent/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg animate-fade-in border border-secondary/20">
              <p className="text-xs sm:text-sm text-secondary font-semibold">Level {question.level}</p>
            </div>
          </div>

          <div className="px-1">
            {/* <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight animate-fade-in">
              {question.question_text}
            </h2> */}
          </div>

          <div className={`grid gap-3 sm:gap-2 ${isImageOption(question.options[0]?.value) ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {question.options.map((opt, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(opt.option)}
                disabled={selectedOption === question.correctAnswer}
                className={`${getOptionClassName(opt.option)} p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 animate-fade-in text-left`}
              >
                {isImageOption(opt.value) ? (
                  <div className="relative">
                    <div className="absolute top-2 left-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary/90 to-secondary/90 flex items-center justify-center font-bold text-primary-foreground text-sm sm:text-base border border-primary/30 shadow-lg">
                      {String.fromCharCode(65 + index)}
                    </div>

                    {selectedOption && opt.option === question.correctAnswer && selectedOption === question.correctAnswer && (
                      <div className="absolute top-2 right-2 z-10">
                        <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-success bg-background rounded-full animate-scale-in" />
                      </div>
                    )}
                    {selectedOption === opt.option && opt.option !== question.correctAnswer && (
                      <div className="absolute top-2 right-2 z-10">
                        <XCircle className="w-6 h-6 sm:w-7 sm:h-7 text-destructive bg-background rounded-full animate-scale-in" />
                      </div>
                    )}

                    <img
                      src={opt.value}
                      alt={`Option ${String.fromCharCode(65 + index)}`}
                      className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary text-sm sm:text-base border border-primary/30">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <p className="text-sm sm:text-base md:text-lg font-medium flex-1 leading-relaxed">{opt.value}</p>

                    {selectedOption && opt.option === question.correctAnswer && selectedOption === question.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-success flex-shrink-0 animate-scale-in" />
                    )}
                    {selectedOption === opt.option && opt.option !== question.correctAnswer && (
                      <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-destructive flex-shrink-0 animate-scale-in" />
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 sm:mt-6">
            {showExplanation ? (
              <div className="p-3 sm:p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border-2 border-primary/20 animate-slide-in-bottom shadow-card relative overflow-hidden">
                <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-secondary flex-shrink-0 mt-0.5 sm:mt-1 animate-pulse-glow" />

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">
                        {isCorrect ? "Correct! 🎉" : "Learn More"}
                      </h3>
                    </div>

                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {question.explanation}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleNextQuestion}
                  disabled={!canProceed}
                  className="w-full mt-3 sm:mt-4 h-11 sm:h-12 text-base sm:text-lg font-semibold shadow-glow transition-bounce hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {canProceed ? "Next Question" : "Wait..."}
                </Button>
              </div>
            ) : (
              <div className="p-3 sm:p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border-2 border-primary/20 animate-slide-in-bottom shadow-card">
                <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="flex-1 px-1">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">
                      Welcome! 👋
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      This is a game of Odd and Even. Select the correct option to earn points and win the game.
                    </p>
                  </div>
                </div>
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
              {question.hint || question.explanation}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuestionCard;