import { Toaster } from "@/components/ui/toaster";
import { useEffect, useRef } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useNavigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Game from "./pages/Game";
import Leaderboard from "./pages/Leaderboard";
import Donate from "./pages/Donate";
import NotFound from "./pages/NotFound";
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
// import { useBackgroundMusic } from "./hooks/useBackgroundMusic";
import { App as CapacitorApp } from '@capacitor/app';
import { useBGMusicStore } from "./store/useBGMusicStore";
import { App as CapApp } from '@capacitor/app';

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
      CapApp.addListener('appStateChange', ({ isActive }) => {
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

  useEffect(() => {
    const backHandler = CapacitorApp.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        navigate(-1);
      } else {
        CapacitorApp.exitApp(); // 🔥 Home page pe ho → exit app
      }
    });

    return () => {
      backHandler.remove();
    };
  }, []);

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
    </QueryClientProvider>
  )
};

export default App;
