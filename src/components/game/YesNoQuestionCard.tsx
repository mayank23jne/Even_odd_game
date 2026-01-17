import { useState } from "react";
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
  onAnswer: (answer: "option1" | "option2") => void; // <- change here
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

const handleAnswer = (value: "yes" | "no") => {
  if (selectedOption) return; // prevent multiple clicks
  const selectedOptionBackend: "option1" | "option2" = value === "yes" ? "option1" : "option2";
  onAnswer(selectedOptionBackend); // send backend-compatible value

  const correct = selectedOptionBackend === question.correctAnswer;
  setIsCorrect(correct);
  setShowExplanation(true);
  setSelectedOption(value);
};

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setShowExplanation(false);
    onNext();
  };

const getButtonStyle = (value: "yes" | "no") => {
  if (!selectedOption) return "hover:scale-[1.03] transition-smooth";

  // Map button value to backend option
  const selectedOptionBackend: "option1" | "option2" = value === "yes" ? "option1" : "option2";

  if (selectedOption === value && selectedOptionBackend !== question.correctAnswer) {
    return "border-destructive bg-destructive/10 scale-[1.02]";
  }

  if (selectedOption === value && selectedOptionBackend === question.correctAnswer) {
    return "border-success bg-success/10 scale-[1.02]";
  }

  // If an option is already selected but this button is not the selected one
  return "opacity-50 cursor-not-allowed";
};


  return (
    <>
      <Card className="p-6 sm:p-8 glass shadow-glow border-2 border-primary/20 animate-scale-in">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            {showHint && !selectedOption && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHintDialog(true)}
                className="gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                Hint
              </Button>
            )}

            <div className="px-4 py-2 rounded-lg bg-secondary/10 border border-secondary/20">
              <p className="text-sm font-semibold">Level {question.level}</p>
            </div>
          </div>

          {/* Question */}
          <h2 className="text-xl sm:text-2xl font-semibold leading-snug">
            {question.question_text}
          </h2>

          {/* YES / NO */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            {(["yes", "no"] as const).map((value) => (
              <Button
                key={value}
                size="lg"
                // disabled={!!selectedOption}
                onClick={() => handleAnswer(value)}
                className={`h-14 text-lg font-semibold rounded-xl border-2 ${getButtonStyle(
                  value
                )}`}
                variant="outline"
              >
                {value.toUpperCase()}
              {selectedOption === value &&
                ( (value === "yes" ? "option1" : "option2") === question.correctAnswer ? (
                  <CheckCircle2 className="ml-2 text-success" />
                ) : (
                  <XCircle className="ml-2 text-destructive" />
                ))}

              </Button>
            ))}
          </div>

          {/* Explanation */}
          <div className="mt-6 p-4 rounded-xl border-2 border-primary/20 bg-primary/5 animate-slide-in-bottom">
            {showExplanation ? (
              <>
                <h3 className="text-lg font-semibold mb-2">
                  {isCorrect ? "Correct! 🎉" : "Incorrect ❌"}
                </h3>
                <p className="text-muted-foreground">
                  {question.explanation}
                </p>

              <Button
              onClick={handleNextQuestion}
              className="w-full mt-4 h-12 text-lg font-semibold"
            >
              Next Question
            </Button>

              </>
            ) : (
              <p className="text-muted-foreground">
                Choose Yes or No to continue the game.
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Hint Dialog */}
      <Dialog open={showHintDialog} onOpenChange={setShowHintDialog}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-secondary" />
              Hint
            </DialogTitle>
            <DialogDescription className="pt-3">
              {question.explanation}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default YesNoQuestionCard;