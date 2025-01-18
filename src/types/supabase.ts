export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          current_career: string | null
          current_location: string | null
          interests: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          current_career?: string | null
          current_location?: string | null
          interests?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          current_career?: string | null
          current_location?: string | null
          interests?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      simulations: {
        Row: {
          id: string
          user_id: string
          career_path: string
          location: string
          interests: string[]
          key_decisions: string[]
          financial_score: number
          happiness_score: number
          career_score: number
          relationships_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          career_path: string
          location: string
          interests?: string[]
          key_decisions?: string[]
          financial_score?: number
          happiness_score?: number
          career_score?: number
          relationships_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          career_path?: string
          location?: string
          interests?: string[]
          key_decisions?: string[]
          financial_score?: number
          happiness_score?: number
          career_score?: number
          relationships_score?: number
          created_at?: string
          updated_at?: string
        }
      }
      decisions: {
        Row: {
          id: string
          simulation_id: string
          decision_text: string
          impact_score: number
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          simulation_id: string
          decision_text: string
          impact_score: number
          timestamp: string
          created_at?: string
        }
        Update: {
          id?: string
          simulation_id?: string
          decision_text?: string
          impact_score?: number
          timestamp?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}