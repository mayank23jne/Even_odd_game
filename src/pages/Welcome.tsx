import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "@/lib/api";
import { Sparkles, Trophy, Brain, Heart, LogOut, Gamepad2, Dices } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import lotusAccent from "@/assets/lotus-accent.png";
import LogoutConfirmModal from "@/components/game/LogoutConfirmModal";

const Welcome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    setUser(auth.getUser());
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const handleGuestPlay = () => {
    if (!selectedGame) return;
    navigate(`/game?mode=guest&type=${selectedGame}`);
  };

  const handlePlayGame = () => {
    if (!selectedGame) return;

    if (user) {
      navigate(`/game?type=${selectedGame}`);
    } else {
      navigate(`/auth?type=${selectedGame}`);
    }
  };


  const handleViewLeaderboard = () => {
    navigate("/leaderboard");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <LogoutConfirmModal
        open={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
        onConfirm={handleLogout}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-background/85 to-background/95" />

      {/* Floating lotus decorations */}
      <img
        src={lotusAccent}
        alt=""
        className="absolute top-10 right-10 w-16 h-16 sm:w-20 sm:h-20 opacity-20 animate-float hidden md:block"
      />
      <img
        src={lotusAccent}
        alt=""
        className="absolute bottom-10 left-10 w-12 h-12 sm:w-16 sm:h-16 opacity-20 animate-float hidden md:block"
        style={{ animationDelay: '1s' }}
      />

      <div className="max-w-4xl w-full space-y-4 sm:space-y-8 relative z-10 px-2 sm:px-0">
        {/* Header */}
        <div className="text-center space-y-2 sm:space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-1.5 min-[350px]:gap-2 sm:gap-3 mb-2 sm:mb-4">
            <Brain className="w-5 h-5 min-[350px]:w-8 min-[350px]:h-8 sm:w-12 sm:h-12 text-primary drop-shadow-lg" />
            <h1 className="text-[20px] min-[350px]:text-3xl sm:text-5xl md:text-7xl font-bold text-foreground drop-shadow-lg whitespace-nowrap">
              Jain Odd-Even
            </h1>
            <Heart className="w-5 h-5 min-[350px]:w-8 min-[350px]:h-8 sm:w-12 sm:h-12 text-accent drop-shadow-lg" />
          </div>
          <p className="text-sm sm:text-xl md:text-2xl text-foreground/90 max-w-2xl mx-auto px-4 leading-snug">
            Learn about Jainism through fun and thoughtful gameplay
          </p>
        </div>

        {/* Main Card */}
        <Card className="p-4 sm:p-8 md:p-12 glass shadow-glow border-2 border-primary/20 animate-scale-in">
          <div className="space-y-4 sm:space-y-8">
            {/* Game Description */}
            <div className="text-center space-y-1 sm:space-y-3">
              <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold text-foreground">
                Find the Odd One Out!
              </h2>
              <p className="text-muted-foreground text-xs sm:text-lg max-w-xl mx-auto px-4">
                Choose the different item from 4 options. Test your knowledge and learn something new!
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-6">
              <div className="text-center p-2 bg-gradient-card rounded-lg border border-border transition-bounce hover:scale-105">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-secondary" />
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Compete</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Monthly prizes for top scorers
                </p>
              </div>
              <div className="text-center p-2 bg-gradient-card rounded-lg border border-border transition-bounce hover:scale-105">
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Learn</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  20 levels of progressive difficulty
                </p>
              </div>
              <div className="text-center p-2 bg-gradient-card rounded-lg border border-border transition-bounce hover:scale-105">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-accent" />
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Have Fun</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Engaging gameplay with rewards
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 sm:space-y-6 animate-slide-up">
              {/* Common Game Selection */}
              <div className="space-y-2 sm:space-y-3">
                {user && (
                  <div className="flex items-center justify-between gap-3 py-1 animate-fade-in">
                    <span className="text-sm sm:text-base font-medium text-foreground">
                      Hello, <span className="text-primary font-bold">{user.name || user.email || 'Player'}</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsLogoutModalOpen(true)}
                      className="h-8 px-3 text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 border border-destructive/20"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-xs font-semibold">Logout</span>
                    </Button>
                  </div>
                )}

                <p className="text-[10px] sm:text-sm font-semibold text-center text-muted-foreground uppercase tracking-wider">
                  Please Select Game Type
                </p>
                <div className="flex gap-3 sm:gap-4 mt-1">
                  <Button
                    variant={selectedGame === "odd-even" ? "default" : "outline"}
                    className={`flex-1 h-12 sm:h-16 border border-primary/40 text-xs sm:text-base font-bold transition-all duration-300 ${selectedGame === "odd-even"
                      ? "bg-primary text-primary-foreground shadow-glow scale-[1.02]"
                      : "hover:bg-primary/5 hover:border-primary/60"
                      }`}
                    onClick={() => setSelectedGame("odd-even")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="tracking-tight">Odd – Even</span>
                      <div className={`p-1 rounded-md transition-colors ${selectedGame === "odd-even" ? "bg-white/20" : "bg-primary/10"}`}>
                        <Gamepad2 className={`w-4 h-4 sm:w-5 sm:h-5 ${selectedGame === "odd-even" ? "text-white" : "text-primary"}`} />
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant={selectedGame === "yes-no" ? "default" : "outline"}
                    className={`flex-1 h-12 sm:h-16 text-xs sm:text-base border border-primary/40 font-bold transition-all duration-300 ${selectedGame === "yes-no"
                      ? "bg-primary text-primary-foreground shadow-glow scale-[1.02]"
                      : "hover:bg-primary/5 hover:border-primary/60"
                      }`}
                    onClick={() => setSelectedGame("yes-no")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="tracking-tight">Yes / No</span>
                      <div className={`p-1 rounded-md transition-colors ${selectedGame === "yes-no" ? "bg-white/20" : "bg-primary/10"}`}>
                        <Dices className={`w-4 h-4 sm:w-5 sm:h-5 ${selectedGame === "yes-no" ? "text-white" : "text-primary"}`} />
                      </div>
                    </div>
                  </Button>
                </div>
              </div>

              {user ? (
                <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
                  <Button
                    onClick={handlePlayGame}
                    disabled={!selectedGame}
                    className="w-full h-11 sm:h-14 text-base sm:text-lg font-semibold shadow-glow transition-bounce hover:scale-105"
                    size="lg"
                  >
                    Play Game
                  </Button>
                  <div className="flex flex-row gap-3 sm:gap-4">
                    <Button
                      onClick={handleViewLeaderboard}
                      variant="outline"
                      className="flex-1 h-10 sm:h-12 border border-primary/50 hover:bg-primary/10 transition-smooth text-xs sm:text-sm"
                    >
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                      Leaderboard
                    </Button>
                    <Button
                      onClick={() => navigate("/donate")}
                      variant="outline"
                      className="flex-1 h-10 sm:h-12 border border-primary/50 hover:bg-primary/10 transition-smooth text-xs sm:text-sm"
                    >
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                      Donate
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
                  <Button
                    onClick={handleGuestPlay}
                    disabled={!selectedGame}
                    variant="default"
                    className="w-full h-11 sm:h-14 text-base sm:text-lg font-semibold shadow-glow transition-bounce hover:scale-105"
                    size="lg"
                  >
                    Play as Guest
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-muted-foreground/10" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate("/auth")}
                    variant="outline"
                    className="w-full h-10 sm:h-12 border border-primary/50 hover:bg-primary/10 transition-smooth text-xs sm:text-sm"
                  >
                    Sign Up / Login to Save Score
                  </Button>

                  <div className="flex flex-row gap-2 sm:gap-4">
                    <Button
                      onClick={handleViewLeaderboard}
                      variant="outline"
                      className="flex-1 h-10 sm:h-12 border border-primary/50 hover:bg-primary/10 transition-smooth text-xs sm:text-sm"
                    >
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                      Leaderboard
                    </Button>
                    <Button
                      onClick={() => navigate("/donate")}
                      variant="outline"
                      className="flex-1 h-10 sm:h-12 border border-primary/50 hover:bg-primary/10 transition-smooth text-xs sm:text-sm"
                    >
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                      Donate
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;
