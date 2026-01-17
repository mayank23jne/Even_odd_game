import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "@/lib/api";
import { Sparkles, Trophy, Brain, Heart } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import lotusAccent from "@/assets/lotus-accent.png";

const Welcome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    setUser(auth.getUser());
  }, []);

  const handleGuestPlay = () => {
    navigate(`/game?mode=guest&type=odd-even`);

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

      <div className="max-w-4xl w-full space-y-6 sm:space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
            <Brain className="w-8 h-8 sm:w-12 sm:h-12 text-primary drop-shadow-lg" />
            <h1 className="text-2xl sm:text-5xl md:text-7xl font-bold text-foreground drop-shadow-lg">
              Jain Odd-Even
            </h1>
            <Heart className="w-8 h-8 sm:w-12 sm:h-12 text-accent drop-shadow-lg" />
          </div>
          <p className="text-base sm:text-xl md:text-2xl text-foreground/90 max-w-2xl mx-auto px-4">
            Learn about Jainism through fun and thoughtful gameplay
          </p>
        </div>

        {/* Main Card */}
        <Card className="p-6 sm:p-8 md:p-12 glass shadow-glow border-2 border-primary/20 animate-scale-in">
          <div className="space-y-6 sm:space-y-8">
            {/* Game Description */}
            <div className="text-center space-y-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground">
                Find the Odd One Out!
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto px-4">
                Choose the different item from 4 options. Test your knowledge and learn something new with each question!
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
            <div className="space-y-3 sm:space-y-4 animate-slide-up">
              {user ? (
                
                <div className="space-y-3 sm:space-y-4">
                  {/* Game Selection */}
                  <div className="flex gap-3">
                    <Button
                      variant={selectedGame === "odd-even" ? "default" : "outline"}
                      className="flex-1 h-11  border-2 border-primary/50  text-sm font-semibold transition-smooth hover:bg-primary/10 transition-smooth"
                      onClick={() => setSelectedGame("odd-even")}
                    >
                      Odd – Even
                    </Button>

                    <Button
                      variant={selectedGame === "yes-no" ? "default" : "outline"}
                      className="flex-1 h-11 text-sm  border-2 border-primary/50 font-semibold transition-smooth hover:bg-primary/10 transition-smooth"
                      onClick={() => setSelectedGame("yes-no")}
                    >
                      Yes / No
                    </Button>
                  </div>

                  <Button
                    onClick={handlePlayGame}
                    disabled={!selectedGame}
                    className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold shadow-glow transition-bounce hover:scale-105"
                    size="lg"
                  >
                    Play Game
                  </Button>
                  <div className="flex flex-row gap-3 sm:gap-4">
                    <Button
                      onClick={handleViewLeaderboard}
                      variant="outline"
                      className="flex-1 h-12 border-2 border-primary/50 hover:bg-primary/10 transition-smooth"
                    >
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Leaderboard
                    </Button>
                    <Button
                      onClick={() => navigate("/donate")}
                      variant="outline"
                      className="flex-1 h-12 border-2 border-primary/50 hover:bg-primary/10 transition-smooth"
                    >
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Donate
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <Button
                    onClick={() => navigate("/auth")}
                    className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold shadow-glow transition-bounce hover:scale-105"
                    size="lg"
                  >
                    Sign Up / Login
                  </Button>
                  <Button
                    onClick={handleGuestPlay}
                    variant="outline"
                    className="w-full h-12 border-2 border-primary/50 hover:bg-primary/10 transition-smooth"
                    size="lg"
                  >
                    Play as Guest (5 questions only)
                  </Button>
                  <div className="flex flex-row gap-3 sm:gap-4 ">
                    <Button
                      onClick={handleViewLeaderboard}
                      variant="outline"
                      className="flex-1 h-12 border-2 border-primary/50 hover:bg-primary/10 transition-smooth"
                    >
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Leaderboard
                    </Button>
                    <Button
                      onClick={() => navigate("/donate")}
                      variant="outline"
                      className="flex-1 h-12 border-2 border-primary/50 hover:bg-primary/10 transition-smooth"
                    >
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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
