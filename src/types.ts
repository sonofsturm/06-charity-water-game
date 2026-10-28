export type SolutionId = 'well' | 'pipeline' | 'rainwater' | 'filtration';

export interface Scenario {
  region: string;
  title: string;
  icon: string;
  image: string;
  description: string;
  climate: string;
  source: string;
  population: string;
  correctAnswer: SolutionId;
  explanation: string;
  fact: string;
}

export interface Solution {
  id: SolutionId;
  icon: string;
  name: string;
  hint: string;
}

export type ScreenType = 'start' | 'how-to' | 'game' | 'end';
