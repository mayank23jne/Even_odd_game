import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";
import { toast } from "sonner";
import lotusAccent from "@/assets/lotus-accent.png";
import { useRazorpayPayment } from "@/hooks/useRazorpay";
import { useState, useEffect } from "react";
import { payment } from "@/lib/api";
import Celebration from "@/components/animation/Celebration";

const Donate = () => {
  const navigate = useNavigate();
  const { startPayment } = useRazorpayPayment();
  const [showCelebration, setShowCelebration] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    amount: ""
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      setIsLoggedIn(true);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        amount: ""
      });
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = () => {
    const amount = parseFloat(formData.amount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    startPayment(
      amount,
      formData,
      async (success) => {
        // const payload = {
        //   amount: amount,
        //   payment_id: success.razorpay_payment_id,
        //   status: "success",
        //   name: formData.name,
        //   email: formData.email,
        //   mobile: formData.mobile,
        //   time: new Date().toISOString(),
        // }
        // await payment.SavePayment(payload);
        setShowCelebration(true);
        // toast.success("Payment successful! Thank you for your support!");
      },
      (err) => {
        toast.error("Payment failed. Please try again.");
      }
    );
  };

  return (
    <>
      {showCelebration && (<Celebration onComplete={() => setShowCelebration(false)} title="Thank you" />)}
      <div className="min-h-screen p-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-primary/5" />
        <img
          src={lotusAccent}
          alt=""
          className="absolute top-20 right-10 w-24 h-24 sm:w-32 sm:h-32 opacity-10 animate-float hidden sm:block"
        />
        <img
          src={lotusAccent}
          alt=""
          className="absolute bottom-20 left-10 w-16 h-16 sm:w-24 sm:h-24 opacity-10 animate-float hidden sm:block"
          style={{ animationDelay: '1.5s' }}
        />

        <div className="max-w-2xl mx-auto py-6 sm:py-8 space-y-6 relative z-10">
          {/* Header */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="hover:bg-primary/10 transition-smooth animate-fade-in"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Main Card */}
          <Card className="p-6 sm:p-8 md:p-12 glass shadow-glow border-2 border-accent/20 animate-scale-in">
            <div className="space-y-6 sm:space-y-8">
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="relative inline-block">
                  <Heart className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-accent" />
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 absolute -top-1 -right-1 text-secondary animate-bounce" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Support Our Initiative</h1>
                <p className="text-sm sm:text-lg text-muted-foreground max-w-xl mx-auto px-4">
                  Your generous donations help us continue creating educational content
                  and spreading knowledge about Jainism through fun and engaging games.
                </p>
              </div>

              {/* Impact Section */}
              <div className="space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
                  <Heart className="w-5 h-5 text-accent" />
                  Your Impact
                </h2>
                <div className="grid gap-3 sm:gap-4">
                  <div className="flex gap-3 p-3 sm:p-4 bg-gradient-card rounded-lg border border-border transition-smooth hover:translate-x-1 hover:border-primary/50">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Create more engaging questions and educational content
                    </p>
                  </div>
                  <div className="flex gap-3 p-3 sm:p-4 bg-gradient-card rounded-lg border border-border transition-smooth hover:translate-x-1 hover:border-primary/50">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Maintain and improve the game infrastructure
                    </p>
                  </div>
                  <div className="flex gap-3 p-3 sm:p-4 bg-gradient-card rounded-lg border border-border transition-smooth hover:translate-x-1 hover:border-primary/50">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Provide monthly prizes for top players
                    </p>
                  </div>
                  <div className="flex gap-3 p-3 sm:p-4 bg-gradient-card rounded-lg border border-border transition-smooth hover:translate-x-1 hover:border-primary/50">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Reach more learners worldwide
                    </p>
                  </div>
                </div>
              </div>

              {/* Donation Form */}
              <div className="space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground text-center">
                  Your Details
                </h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-foreground">
                      Amount (₹) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={formData.amount}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/\D/g, "");
                        setFormData({ ...formData, amount: cleaned });
                      }}
                      placeholder="Enter amount"
                      className="bg-background/50 border-border focus:border-primary transition-smooth"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      Name <span className="text-muted-foreground text-xs">(optional)</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={isLoggedIn}
                      placeholder="Enter your name"
                      className="bg-background/50 border-border focus:border-primary transition-smooth"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email <span className="text-muted-foreground text-xs">(optional)</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isLoggedIn}
                      placeholder="Enter your email"
                      className="bg-background/50 border-border focus:border-primary transition-smooth"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="text-foreground">
                      Mobile Number <span className="text-muted-foreground text-xs">(optional)</span>
                    </Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="Enter your mobile number"
                      className="bg-background/50 border-border focus:border-primary transition-smooth"
                    />
                  </div>
                </div>

                {/* UPI & QR Code Section */}
                {/* <div className="p-6 bg-white/50 rounded-xl border-2 border-dashed border-accent/30 space-y-4 animate-fade-in">
                  <div className="text-center space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Scan to Donate via UPI
                    </p>
                    <div className="relative mx-auto w-48 h-48 bg-white p-2 rounded-lg shadow-inner">
                      <img
                        src="/src/assets/upi-qr.png"
                        alt="UPI QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground">UPI ID</p>
                      <p className="text-lg font-mono font-bold text-accent">jain-odd-even@upi</p>
                    </div>
                  </div>

                  <p className="text-xs text-center text-muted-foreground italic">
                    * You can also use the form above for secure card/netbanking payments.
                  </p>
                </div> */}

                {/* Donate Now Button */}
                <Button
                  onClick={handlePayment}
                  className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow transition-smooth hover:scale-[1.02]"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Pay via Razorpay
                </Button>
              </div>

              {/* Thank You Message */}
              <div className="text-center p-4 sm:p-6 bg-accent/10 rounded-xl border border-accent/20 animate-fade-in">
                <p className="text-accent font-medium text-base sm:text-lg">
                  🙏 Thank you for your support!
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  Every contribution, no matter how small, makes a difference.
                </p>
              </div>

              {/* Back Button */}
              <Button
                onClick={() => navigate("/")}
                className="w-full h-12 font-semibold transition-bounce hover:scale-105"
              >
                Back to Game
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};   
export default Donate;
