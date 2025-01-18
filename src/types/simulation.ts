export interface LifeSimulation {
  id: string;
  user_id: string;
  career_path: string;
  location: string;
  interests: string[];
  key_decisions: string[];
  created_at: string;
  financial_score: number;
  happiness_score: number;
  career_score: number;
  relationships_score: number;
}

export interface UserProfile {
  id: string;
  email: string;
  current_career: string;
  current_location: string;
  interests: string[];
  created_at: string;
}