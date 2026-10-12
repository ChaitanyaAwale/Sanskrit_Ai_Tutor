const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'API request failed');
  }

  return response.json();
}

export const api = {
  auth: {
    login: (credentials: any) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    signup: (data: any) => apiRequest('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  },
  lesson: {
    attempt: (data: { lesson_id: number; correct: boolean; username: string }) =>
      apiRequest('/lesson/attempt', {
        method: 'POST',
        body: JSON.stringify({
          lesson_id: data.lesson_id,
          correct: data.correct,
          username: data.username,
        }),
      }),
  },
  lessons: {
    attempt: (data: { lesson_id: number; correct: boolean; username: string }) =>
      apiRequest('/lesson/attempt', {
        method: 'POST',
        body: JSON.stringify({
          lesson_id: data.lesson_id,
          correct: data.correct,
          username: data.username,
        }),
      }),
    getAll: (level?: string) => apiRequest(`/lessons${level ? `?level=${level}` : ''}`),
    getById: (id: string | number) => apiRequest(`/lessons/${id}`),
    getGreetings: () => apiRequest('/api/lessons/greetings'),
    getNumbers: () => apiRequest('/api/lessons/numbers'),
    getSelfIntro: () => apiRequest('/api/lessons/self-intro'),
    getPronouns: () => apiRequest('/api/lessons/pronouns'),
    getVerbs: () => apiRequest('/api/lessons/verbs'),
    getNouns: () => apiRequest('/api/lessons/nouns'),
    getFamily: () => apiRequest('/api/lessons/family'),
    getQuestionWords: () => apiRequest('/api/lessons/questions'),
    getTimeAndDays: () => apiRequest('/api/lessons/time'),
    getDailyQuestions: () => apiRequest('/api/daily-questions'),
    getVibhakti: () => apiRequest('/api/lessons/vibhakti'),
    getSandhi: () => apiRequest('/api/lessons/sandhi'),
    getTenses: () => apiRequest('/api/lessons/tenses'),
    getMoods: () => apiRequest('/api/lessons/moods'),
    getPronounsExtended: () => apiRequest('/api/lessons/pronouns-extended'),
    getUpasarga: () => apiRequest('/api/lessons/upasarga'),
    getVoice: () => apiRequest('/api/lessons/voice'),
    getIndeclinables: () => apiRequest('/api/lessons/indeclinables'),
    getParticiples: () => apiRequest('/api/lessons/participles'),
    getReadingComposition: () => apiRequest('/api/lessons/reading-composition'),
    getSamasa1: () => apiRequest('/api/lessons/samasa1'),
    getSamasa2: () => apiRequest('/api/lessons/samasa2'),
    getParticiples2: () => apiRequest('/api/lessons/participles2'),
    getStriPratyaya: () => apiRequest('/api/lessons/stri-pratyaya'),
    getChandas: () => apiRequest('/api/lessons/chandas'),
  },
  user: {
    getProgress: (username: string, asOfDate?: string) =>
      apiRequest(`/progress/${username}${asOfDate ? `?as_of_date=${encodeURIComponent(asOfDate)}` : ''}`),
    getActivities: (username: string) => apiRequest(`/activities/${username}`),
    getDashboardStats: (username: string) => apiRequest(`/dashboard/stats/${username}`),
    getRecommendation: (username: string) => apiRequest(`/recommendation/${username}`),
    getBKTSummary: (username: string) => apiRequest(`/bkt/summary/${username}`),
    getBKTMastery: (username: string) => apiRequest(`/bkt/mastery/${username}`),
    getPersistentDashboard: (username: string) => apiRequest(`/dashboard/${username}`),
    getStreak: (username: string, asOfDate?: string) =>
      apiRequest(`/streak/${username}${asOfDate ? `?as_of_date=${encodeURIComponent(asOfDate)}` : ''}`),
    getGrammarHistory: (username: string, limit = 20) => apiRequest(`/grammar/history/${username}?limit=${limit}`),
    recordDailyActivity: (username: string, score_percent = 100, activity_date?: string) =>
      apiRequest(`/streak/${username}/activity`, {
        method: 'POST',
        body: JSON.stringify({ score_percent, ...(activity_date ? { activity_date } : {}) }),
      }),
    completeLesson: (username: string, lesson_id: number | string) =>
      apiRequest(`/progress/${username}/complete`, {
        method: 'POST',
        body: JSON.stringify({ lesson_id }),
      }),
    submitQuiz: (username: string, data: { lesson_id: string; answers: Record<string, number>; quiz_id?: string }) =>
      apiRequest(`/progress/${username}/quiz`, { method: 'POST', body: JSON.stringify(data) }),
  },
  tools: {
    translate: (data: { text: string; direction: string; use_api?: boolean }) => 
      apiRequest('/translate', { method: 'POST', body: JSON.stringify(data) }),
    checkGrammar: (text: string, use_ai: boolean = false, username?: string) =>
      apiRequest('/grammar/check', {
        method: 'POST',
        body: JSON.stringify({ text, use_ai, ...(username ? { username } : {}) }),
      }),
  },
  game: {
    start: () => apiRequest('/game/start'),
    turn: (data: { current_position: number; asked_word: string; user_answer: string }) =>
      apiRequest('/game/turn', { method: 'POST', body: JSON.stringify(data) }),
    oddQuestion: () => apiRequest('/game/odd/question'),
    oddAnswer: (data: { question_data: any; user_choice: number }) =>
      apiRequest('/game/odd/answer', { method: 'POST', body: JSON.stringify(data) }),
  }
};
