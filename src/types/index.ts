export interface Racer {
  id: string;
  name: string;
  serial: string;
  image: string;
  bgImage?: string;
  color: string;
  panelColor: string;
  traits: [string, string];
  bio: string;
  stats: {
    speed: number;
    acceleration: number;
    grit: number;
    handling: number;
  };
  rarity: 'Legendary' | 'Epic' | 'Rare';
}

export interface RoadmapPhase {
  phase: string;
  badge: string;
  title: string;
  description: string;
  status: 'Completed' | 'Active' | 'Upcoming';
  details: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface GameBike {
  id: number;
  rider: string;
  odds: string;
  winRate: string;
  color: string;
}
