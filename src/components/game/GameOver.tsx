import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom"
import { Trophy, Clock, CheckCircle, Target, Share2, Loader2, LogOut} from "lucide-react";


import { toast } from "sonner";
import { Share } from "@capacitor/share";
import html2canvas from "html2canvas";
import { Filesystem, Directory } from "@capacitor/filesystem";

interface GameOverProps {
  score: number;
  gameWon: boolean;
  questionsAnswered: number;
  questionsCorrect: number;
  timePlayed: number;
  isGuestMode: boolean;
}

const GameOver = ({
  score,
  gameWon,
  questionsAnswered,
  questionsCorrect,
  timePlayed,
  isGuestMode,
}: GameOverProps) => {
  const navigate = useNavigate();
  const shareRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  const handleLogout = () => {
  localStorage.clear();   
  localStorage.removeItem("token");
  localStorage.removeItem("user");
       // 🔥 FULL CLEAR
  navigate("/", { replace: true }); // 🔁 Login page
};


  const handleShare = async () => {
    if (!shareRef.current) return;
    setIsSharing(true);
    const text = `I scored ${score} points in Jain Odd-Even! ${questionsCorrect}/${questionsAnswered} correct answers. Can you beat my score? \n\nPlay now: https://play.google.com/store/apps/details?id=com.jainoddeven.game`;

    try {
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: "#FFFBF5",
        useCORS: true,
        logging: false,
        scale: 2,
        allowTaint: true,
        removeContainer: true,
        imageTimeout: 0,
      });

      const base64Data = canvas.toDataURL("image/png", 1.0);
      const fileName = `score-${Date.now()}.png`;

      // Save to temporary filesystem
      const result = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
      });

      // Share via Capacitor
      await Share.share({
        title: "Jain Odd-Even Score",
        text: text,
        url: result.uri,
        dialogTitle: "Share your score",
      });

    } catch (error) {
      console.error("Share failed", error);
      // Fallback
      navigator.clipboard.writeText(text);
      toast.success("Score copied to clipboard!");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen p-4 relative overflow-hidden flex items-center justify-center">
      {/* Logout Button */}
       {!isGuestMode && (
        <button
          onClick={handleLogout}
          className="absolute top-7 right-7 z-20 p-2 rounded-full
                    bg-white/80 hover:bg-white shadow-md
                    text-destructive transition hover:scale-110"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
       )} 

      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="absolute inset-0 bg-gradient-to-tl from-secondary/5 via-transparent to-primary/5 animate-pulse" />

      <div className="max-w-2xl w-full space-y-4 sm:space-y-6 relative z-10">
        <Card className="p-6 sm:p-8 md:p-12 glass shadow-glow border-2 border-primary/20 animate-scale-in">
          <div className="text-center space-y-4 sm:space-y-6">
            {/* Title */}
            <div className="space-y-2 sm:space-y-3">
              <div className="relative inline-block">
                <Trophy className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto text-secondary relative z-10" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                {gameWon ? "You Won!" : "Game Over"}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2">
                {gameWon ? "You won the game!" : "Great effort! Here's how you did:"}
              </p>
            </div>

            {/* Score Display */}
            <div className="bg-gradient-hero p-5 sm:p-6 md:p-8 rounded-2xl shadow-glow mt-4">
              <p className="text-xs sm:text-sm text-primary-foreground/80 mb-1 sm:mb-2">Final Score</p>
              <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground">{score}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mt-4">
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-border">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-success" />
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{questionsCorrect}</p>
                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-border">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-accent" />
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{questionsAnswered}</p>
                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Attempted</p>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-border">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-game-timer" />
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{timePlayed}s</p>
                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Time</p>
              </div>
            </div>

            {/* Guest Mode Message */}
            {isGuestMode && (
              <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/30 rounded-xl p-3 sm:p-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <p className="text-sm sm:text-base text-accent font-medium">
                  Sign up to save your score and compete on the leaderboard!
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-4">
              <Button
                onClick={() => window.location.reload()}
                className="w-full h-11 sm:h-12 text-base sm:text-lg font-semibold shadow-glow transition-bounce hover:scale-105 animate-slide-in-bottom"
                style={{ animationDelay: '0.6s' }}
              >
                Play Again
              </Button>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 animate-slide-in-bottom" style={{ animationDelay: '0.7s' }}>
                <Button
                  onClick={handleShare}
                  disabled={isSharing}
                  variant="outline"
                  className="flex-1 h-10 sm:h-11 text-sm sm:text-base transition-smooth hover:border-accent/50 hover:scale-105"
                >
                  {isSharing ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin" /> : <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />}
                  Share
                </Button>
                <Button
                  onClick={() => navigate("/leaderboard")}
                  variant="outline"
                  className="flex-1 h-10 sm:h-11 text-sm sm:text-base transition-smooth hover:border-secondary/50 hover:scale-105"
                >
                  <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Leaderboard
                </Button>
              </div>
              <Button
                onClick={() => navigate("/")}
                variant="ghost"
                className="w-full h-10 text-sm sm:text-base transition-smooth hover:bg-primary/10 animate-fade-in"
                style={{ animationDelay: '0.8s' }}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Hidden Share Container */}
      <div
        ref={shareRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          padding: '20px',
          backgroundColor: '#FFFBF5',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          borderRadius: '10px'
        }}
      >
        {/* Title */}
        <div className="space-y-2 sm:space-y-3">
          <div className="relative inline-block">
            <Trophy className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto text-secondary relative z-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            {gameWon ? "You Won!" : "Game Over"}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2">
            {gameWon ? "You won the game!" : "Great effort! Here's how you did:"}
          </p>
        </div>

        {/* Score Display */}
        <div className="bg-gradient-hero p-5 sm:p-6 md:p-8 rounded-2xl shadow-glow mt-4">
          <p className="text-xs sm:text-sm text-primary-foreground/80 mb-1 sm:mb-2">Final Score</p>
          <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground">{score}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mt-4">
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-border">
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{questionsCorrect}</p>
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Correct</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-border">
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{questionsAnswered}</p>
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Attempted</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-border">
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{timePlayed}s</p>
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Time</p>
          </div>
        </div>
        <div style={{ marginTop: '24px', color: '#666', fontSize: '16px' }}>
          <p style={{ margin: 0 }}>Play Jain Odd-Even Game</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#f6885cff' }}>Available on Google Play Store</p>
        </div>
      </div>

    </div>
  );
};

export default GameOver;
