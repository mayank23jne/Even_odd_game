import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/api";
import { toast } from "sonner";
import { Brain, ArrowLeft } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    if (auth.isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await auth.signIn(email, password);
        toast.success("Welcome back!");
        navigate("/");
      } else {
        await auth.signUp(email, password, fullName);
        toast.success("Account created successfully! Welcome to Jain Odd-Even!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 relative overflow-hidden flex items-center justify-center">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="absolute inset-0 bg-gradient-to-tl from-secondary/5 via-transparent to-primary/5 animate-pulse" />
      
      <div className="max-w-md w-full space-y-4 sm:space-y-6 relative z-10">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="hover:bg-primary/10 transition-smooth animate-fade-in"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="p-6 sm:p-8 glass shadow-glow border-2 border-primary/20 animate-scale-in">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-3 animate-fade-in">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                <Brain className="w-12 h-12 sm:w-14 sm:h-14 mx-auto text-primary relative z-10 animate-float" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {isLogin ? "Welcome Back!" : "Join Jain Odd-Even"}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground px-2">
                {isLogin
                  ? "Sign in to continue your learning journey"
                  : "Create an account to track your progress"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2 animate-slide-in-bottom">
                  <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    className="h-11 sm:h-12 transition-smooth focus:border-primary"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 sm:h-12 transition-smooth focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-11 sm:h-12 transition-smooth focus:border-primary"
                />
                <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
              </div>

              <Button
                type="submit"
                className="w-full h-11 sm:h-12 text-base sm:text-lg font-semibold shadow-glow transition-bounce hover:scale-105 mt-6"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : isLogin ? "Sign In" : "Sign Up"}
              </Button>
            </form>

            {/* Toggle */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:text-primary/80 transition-smooth hover:underline"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
