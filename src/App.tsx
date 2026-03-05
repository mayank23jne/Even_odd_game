import { Toaster } from "@/components/ui/toaster";
import { useEffect, useRef } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Game from "./pages/Game";
import Leaderboard from "./pages/Leaderboard";
import Donate from "./pages/Donate";
import NotFound from "./pages/NotFound";
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
// import { useBackgroundMusic } from "./hooks/useBackgroundMusic";
// import { useBackgroundMusic } from "./hooks/useBackgroundMusic";
import { App as CapacitorApp } from '@capacitor/app';
import { useBGMusicStore } from "./store/useBGMusicStore";

const queryClient = new QueryClient();
const App = () => {
  // useBackgroundMusic();
  const lastScrollY = useRef(0);
  const isStatusBarHidden = useRef(false);
  const navigate = useNavigate();
  const initialize = useBGMusicStore(state => state.initialize);
  const cleanup = useBGMusicStore(state => state.cleanup);
  const startMusic = useBGMusicStore(state => state.startMusic);
  const pause = useBGMusicStore(state => state.pause);
  const resume = useBGMusicStore(state => state.resume);

  useEffect(() => {
    // Initialize on mount
    initialize();

    // Auto-start music on first user interaction
    const handleFirstInteraction = () => {
      console.log('👆 First interaction detected');
      startMusic();

      // Remove listeners
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    // App state change listener (background/foreground)
    let appStateListener: any;

    if (Capacitor.isNativePlatform()) {
      CapacitorApp.addListener('appStateChange', ({ isActive }) => {
        console.log('📱 App state changed:', isActive ? 'FOREGROUND' : 'BACKGROUND');

        if (isActive) {
          // App foreground mein aaya
          console.log('✅ App in foreground - resuming music');
          resume();
        } else {
          // App background mein gaya
          console.log('🔇 App in background - pausing music');
          pause();
        }
      }).then(listener => {
        appStateListener = listener;
      });
    }

    return () => {
      cleanup();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);

      // Remove app state listener
      if (appStateListener) {
        appStateListener.remove();
      }
    };
  }, [initialize, cleanup, startMusic, pause, resume]);

  const location = useLocation();

  useEffect(() => {
    const handleBackButton = async () => {
      const backHandler = await CapacitorApp.addListener("backButton", ({ canGoBack }) => {
        // More robust check for the game route
        if (window.location.pathname.startsWith('/game')) {
          console.log('🛑 App.tsx: Game route detected via startsWith, skipping global back handler');
          return;
        }

        if (canGoBack) {
          navigate(-1);
        } else {
          CapacitorApp.exitApp();
        }
      });

      return backHandler;
    };

    const handlerPromise = handleBackButton();

    return () => {
      handlerPromise.then(handler => handler.remove());
    };
  }, [navigate]); // navigate is stable, no need to add location here as we use window.location.pathname for current value

  useEffect(() => {
    const handleScroll = async () => {
      if (Capacitor.getPlatform() === "web") return;

      const currentScrollY = window.scrollY;

      if (!isStatusBarHidden.current && currentScrollY > 20) {
        try {
          await StatusBar.setOverlaysWebView({ overlay: true });
          await StatusBar.hide();
          isStatusBarHidden.current = true;
        } catch (err) {
          console.warn("StatusBar hide failed:", err);
        }
      } else if (isStatusBarHidden.current && currentScrollY <= 0) {
        try {
          await StatusBar.show();
          isStatusBarHidden.current = false;
        } catch (err) {
          console.warn("StatusBar show failed:", err);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId="39775445147-e6ik1trgf0ti232lg8t6n93i8q2vqcum.apps.googleusercontent.com">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/game" element={<Game />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/donate" element={<Donate />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  )
};

export default App;
