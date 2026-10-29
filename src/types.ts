export type SolutionId = 'well' | 'pipeline' | 'rainwater' | 'filtration';

export type ObstacleType = 'hazard' | 'benefit';

export interface Obstacle {
  id: string;
  icon: string;
  label: string;
  type: ObstacleType;
}

export interface Scenario {
  region: string;
  title: string;
  icon: string;
  image: string;
  description: string;
  climate: string;
  source: string;
  population: string;
  peopleCount: number;
  dailyHoursSaved: number;
  correctAnswer: SolutionId;
  explanation: string;
  fact: string;
  obstacles: Obstacle[];
}

export interface Solution {
  id: SolutionId;
  icon: string;
  name: string;
  hint: string;
}

export type ScreenType = 'start' | 'how-to' | 'links' | 'game' | 'end';

export type DifficultyId = 'apprentice' | 'planner' | 'expert';

export interface DifficultyConfig {
  id: DifficultyId;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  timerMode: 'global' | 'per-community';
  initialTime: number; // 60s for apprentice, 45s for planner, 15s per-community for expert
  showHints: boolean;
  lives: number | null; // null for unlimited, 3 for planner, 2 for expert
  penaltyPoints: number; // 5 for apprentice/planner, 10 for expert
  minPassCommunities: number; // 1 for apprentice, 3 for planner, 4 for expert
}

export interface Milestone {
  scoreThreshold: number;
  badge: string;
  title: string;
  message: string;
}

