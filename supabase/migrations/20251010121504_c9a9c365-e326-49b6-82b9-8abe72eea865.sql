-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  is_guest boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create questions table
CREATE TABLE public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level integer NOT NULL CHECK (level >= 1 AND level <= 20),
  question_text text NOT NULL,
  option1 text NOT NULL, -- This is always the correct answer
  option2 text NOT NULL,
  option3 text NOT NULL,
  option4 text NOT NULL,
  explanation text NOT NULL,
  category text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions are viewable by everyone"
  ON public.questions FOR SELECT
  USING (true);

-- Create user_played_questions table to track which questions users have played
CREATE TABLE public.user_played_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE,
  played_at timestamptz DEFAULT now(),
  UNIQUE(user_id, question_id)
);

ALTER TABLE public.user_played_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own played questions"
  ON public.user_played_questions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own played questions"
  ON public.user_played_questions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create game_sessions table
CREATE TABLE public.game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  score integer DEFAULT 0,
  questions_answered integer DEFAULT 0,
  questions_correct integer DEFAULT 0,
  time_played integer DEFAULT 0, -- in seconds
  completed_at timestamptz DEFAULT now(),
  month integer DEFAULT EXTRACT(MONTH FROM now()),
  year integer DEFAULT EXTRACT(YEAR FROM now())
);

ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions"
  ON public.game_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
  ON public.game_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create monthly_scores table for leaderboard
CREATE TABLE public.monthly_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  month integer NOT NULL,
  year integer NOT NULL,
  total_score integer DEFAULT 0,
  games_played integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, month, year)
);

ALTER TABLE public.monthly_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Monthly scores are viewable by everyone"
  ON public.monthly_scores FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own monthly scores"
  ON public.monthly_scores FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own monthly scores"
  ON public.monthly_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create user_stats table for total statistics
CREATE TABLE public.user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  total_games_played integer DEFAULT 0,
  total_time_played integer DEFAULT 0,
  total_questions_answered integer DEFAULT 0,
  total_questions_correct integer DEFAULT 0,
  total_score integer DEFAULT 0,
  highest_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stats"
  ON public.user_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON public.user_stats FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
  ON public.user_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger to create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
  );
  
  INSERT INTO public.user_stats (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_monthly_scores_updated_at
  BEFORE UPDATE ON public.monthly_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();