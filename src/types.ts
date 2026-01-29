export type Category = 'religious' | 'geographical' | 'societal' | 'national';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  lastAnswerTime?: number;
  isReady: boolean;
}

export type GameStatus =
  | 'IDLE'
  | 'LOBBY'
  | 'STARTING'
  | 'QUESTION'
  | 'SHOW_ANSWER'
  | 'FINAL_RESULTS';

export interface GameState {
  roomId: string;
  status: GameStatus;
  category: Category | null;
  questions: Question[];
  currentQuestionIndex: number;
  players: Player[];
  timer: number;
}

export interface CategoryInfo {
  id: Category;
  title: string;
  icon: string;
  color: string;
  description: string;
}

export type GameMessage =
  | { type: 'PLAYER_JOINED'; senderId: string; payload: Player }
  | { type: 'SYNC_STATE'; senderId: string; payload: GameState }
  | {
      type: 'SUBMIT_ANSWER';
      senderId: string;
      payload: { isCorrect: boolean; timeRemaining: number };
    };
