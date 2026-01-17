import { Save } from "lucide-react";

const API_BASE_URL = 'https://evenodd.api.jyada.in/api';

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

// Auth APIs
export const auth = {
  signUp: async (email: string, password: string, fullName: string) => {
    const data = await apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name: fullName }),
    });
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  signIn: async (email: string, password: string) => {
    const data = await apiCall('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  signOut: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },
};

// Questions APIs
export const questions = {
  getAll: async () => {
    return apiCall('/questions');
  },

  checkAnswer: async (id, answer) => {
    return apiCall(`/questions/check?id=${id}&answer=${answer}`)
  }
};

// **Yes/No Questions APIs**
export const yesNoQuestions = {
  getAll: async (level?: number, limit: number = 50, offset: number = 0) => {
    const query = new URLSearchParams();
    if (level) query.append('level', level.toString());
    query.append('limit', limit.toString());
    query.append('offset', offset.toString());

    return apiCall(`/yesnoquestions?${query.toString()}`);
  },

  getByLevel: async (level: number) => {
    return apiCall(`/yesnoquestions/level/${level}`);
  },

  checkAnswer: async (id: number | string, answer: string) =>
    apiCall(`/yesnoquestions/check?id=${id}&answer=${answer}`),

  getStats: async () => apiCall('/yesnoquestions/stats'),
};

// Game Session APIs
export const gameSessions = {
  create: async (sessionData: {
    user_id: number;
    score: number;
    questions_answered: number;
    correct_answers: number;
    time_taken: number;
  }) => {
    return apiCall('/game/store-session', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },

  getUserSessions: async () => {
    return apiCall('/game-sessions');
  },
};

// Monthly Scores APIs
export const monthlyScores = {
  get: async (year: number, month: number) => {
    return apiCall(`game/monthly-scores?year=${year}&month=${month}`);
  },

  upsert: async (scoreData: {
    year: number;
    month: number;
    total_score: number;
    games_played: number;
  }) => {
    return apiCall('/monthly-scores', {
      method: 'POST',
      body: JSON.stringify(scoreData),
    });
  },
};

// User Stats APIs
export const userStats = {
  get: async () => {
    return apiCall('/user-stats');
  },

  update: async (statsData: {
    total_games_played: number;
    total_time_played: number;
    total_questions_answered: number;
    total_questions_correct: number;
    total_score: number;
    highest_score: number;
  }) => {
    return apiCall('/user-stats', {
      method: 'PUT',
      body: JSON.stringify(statsData),
    });
  },
};

// Leaderboard APIs
export const leaderboard = {
  get: async (year: number, month: number, limit: number = 50) => {
    return apiCall(`/leaderboard?year=${year}&month=${month}&limit=${limit}`);
  },
};

export const payment = {
  SavePayment: async (payload) => {
    return apiCall('/save-payment', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
}
