/*
  # Initial Schema for Parallel Lives Application

  1. New Tables
    - `profiles`
      - Stores user profile information
      - Contains current life details and preferences
    - `simulations`
      - Stores generated life simulations
      - Includes scores and metrics for different life aspects
    - `decisions`
      - Stores key life decisions for each simulation
      - Links to simulations table

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  current_career text,
  current_location text,
  interests text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create simulations table
CREATE TABLE IF NOT EXISTS simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  career_path text NOT NULL,
  location text NOT NULL,
  interests text[],
  key_decisions text[],
  financial_score integer CHECK (financial_score >= 0 AND financial_score <= 100),
  happiness_score integer CHECK (happiness_score >= 0 AND happiness_score <= 100),
  career_score integer CHECK (career_score >= 0 AND career_score <= 100),
  relationships_score integer CHECK (relationships_score >= 0 AND relationships_score <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create decisions table
CREATE TABLE IF NOT EXISTS decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  simulation_id uuid REFERENCES simulations(id) ON DELETE CASCADE NOT NULL,
  decision_text text NOT NULL,
  impact_score integer CHECK (impact_score >= 0 AND impact_score <= 100),
  timestamp timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view own simulations"
  ON simulations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own simulations"
  ON simulations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own simulations"
  ON simulations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own simulations"
  ON simulations FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own decisions"
  ON decisions FOR SELECT
  TO authenticated
  USING (
    simulation_id IN (
      SELECT id FROM simulations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create decisions for own simulations"
  ON decisions FOR INSERT
  TO authenticated
  WITH CHECK (
    simulation_id IN (
      SELECT id FROM simulations WHERE user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_simulations_updated_at
  BEFORE UPDATE ON simulations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();