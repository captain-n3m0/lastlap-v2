/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RacerStats {
  speed: number;
  acceleration: number;
  grit: number;
  handling: number;
}

export interface Racer {
  id: string;
  name: string;
  serial: string;
  image: string;
  bgImage: string;
  color: string;
  panelColor: string;
  traits: string[];
  bio: string;
  stats: RacerStats;
  rarity: 'Legendary' | 'Epic' | 'Rare' | string;
  archetype?: string;
  bike?: string;
}

export interface GameBike {
  id: number;
  rider: string;
  name?: string;
  odds: string;
  winRate: string;
  color: string;
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  status: 'Completed' | 'Active' | 'Upcoming' | string;
  description: string;
  details: string[];
  badge?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface TokenUtility {
  title: string;
  percent: string;
  tag: string;
  description: string;
}
