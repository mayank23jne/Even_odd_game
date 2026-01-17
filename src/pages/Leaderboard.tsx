import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { leaderboard as leaderboardApi } from "@/lib/api";
import { ArrowLeft, Trophy, Medal, Award, Crown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import jainPattern from "@/assets/jain-pattern.png";

interface LeaderboardEntry {
  user_id: string;
  total_score: number;
  games_played: number;
  full_name?: string;
  email?: string;
}

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    loadLeaderboard();
  }, [selectedMonth]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const [year, month] = selectedMonth.split("-").map(Number);
      const data = await leaderboardApi.get(year, month, 50);
      setLeaderboard(data || []);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 3; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const label = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      options.push({ value, label });
    }
    return options;
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-secondary" />;
    if (index === 1) return <Medal className="w-6 h-6 text-primary" />;
    if (index === 2) return <Award className="w-6 h-6 text-accent" />;
    return null;
  };

  const getRankClass = (index: number) => {
    if (index === 0) return "bg-gradient-to-r from-secondary/10 to-primary/10 border-secondary";
    if (index === 1) return "bg-gradient-to-r from-primary/10 to-accent/10 border-primary";
    if (index === 2) return "bg-gradient-to-r from-accent/10 to-secondary/10 border-accent";
    return "bg-card/50";
  };

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url(${jainPattern})`,
          backgroundSize: '200px',
          backgroundRepeat: 'repeat',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      <div className="max-w-4xl mx-auto py-6 sm:py-8 space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="hover:bg-primary/10 transition-smooth"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Title Card */}
        <Card className="p-6 sm:p-8 glass shadow-glow border-2 border-primary/20 animate-scale-in">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="relative inline-block">
                <Trophy className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-secondary " />
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 absolute -top-1 -right-1 text-primary animate-bounce" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Leaderboard</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Top scorers of the month compete for amazing prizes!
              </p>
            </div>

            {/* Month Selector */}
            <div className="flex justify-center">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getMonthOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Leaderboard List */}
            <div className="space-y-2 sm:space-y-3">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading leaderboard...</p>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4 animate-float" />
                  <p className="text-muted-foreground">
                    No scores yet for this month. Be the first to play!
                  </p>
                </div>
              ) : (
                leaderboard.map((entry, index) => (
                  <div
                    key={entry.user_id}
                    className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 transition-smooth hover:scale-[1.02] hover:border-primary/50 animate-fade-in ${getRankClass(
                      index
                    )}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Rank */}
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 font-bold text-primary flex-shrink-0 relative">
                      {getRankIcon(index) || `#${index + 1}`}
                      {index < 3 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full animate-pulse" />
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-foreground truncate">
                        {entry.full_name || "Anonymous Player"}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {entry.games_played} games
                      </p>
                    </div>

                    {/* Score */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl sm:text-2xl font-bold text-primary">
                        {entry.total_score}
                      </p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Prize Info */}
            <div className="mt-6 p-4 bg-gradient-card rounded-xl border border-border text-center animate-fade-in">
              <p className="text-xs sm:text-sm text-muted-foreground">
                🎁 Top 10 players win prizes each month! Keep playing to climb the ranks.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
