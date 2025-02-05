-- Create prompts table
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  negative_prompt TEXT DEFAULT '',
  aspect_ratio TEXT NOT NULL DEFAULT '1:1',
  prompt_strength FLOAT NOT NULL DEFAULT 0.8,
  steps INTEGER NOT NULL DEFAULT 28,
  guidance_scale FLOAT NOT NULL DEFAULT 7.5,
  num_outputs INTEGER NOT NULL DEFAULT 1,
  seed INTEGER NOT NULL DEFAULT -1,
  output_format TEXT NOT NULL DEFAULT 'webp',
  output_quality INTEGER NOT NULL DEFAULT 90,
  safety_checker BOOLEAN NOT NULL DEFAULT true,
  hf_loras TEXT[] NOT NULL DEFAULT ARRAY['AndyVampiro/fog'],
  lora_scales FLOAT[] NOT NULL DEFAULT ARRAY[1.0],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  CONSTRAINT prompt_strength_range CHECK (prompt_strength BETWEEN 0.1 AND 1.0),
  CONSTRAINT steps_range CHECK (steps BETWEEN 1 AND 100),
  CONSTRAINT guidance_scale_range CHECK (guidance_scale BETWEEN 1.0 AND 20.0),
  CONSTRAINT num_outputs_range CHECK (num_outputs BETWEEN 1 AND 4),
  CONSTRAINT output_quality_range CHECK (output_quality BETWEEN 1 AND 100),
  CONSTRAINT valid_aspect_ratio CHECK (aspect_ratio IN ('1:1', '16:9'))
);

-- Add RLS policies
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own prompts"
  ON prompts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prompts"
  ON prompts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to log prompts
CREATE OR REPLACE FUNCTION log_prompt()
RETURNS TRIGGER AS $$
BEGIN
  RAISE LOG 'New prompt: %', NEW.prompt;
  RAISE LOG 'Parameters: ratio=%, strength=%, steps=%, guidance=%, outputs=%',
    NEW.aspect_ratio, NEW.prompt_strength, NEW.steps, NEW.guidance_scale, NEW.num_outputs;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to log prompts
CREATE TRIGGER log_prompt_trigger
  AFTER INSERT ON prompts
  FOR EACH ROW
  EXECUTE FUNCTION log_prompt(); 