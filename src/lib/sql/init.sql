CREATE TABLE image_entries (
  id SERIAL PRIMARY KEY,
  image_id INT NOT NULL,
  team_name VARCHAR(128) NOT NULL,
  image_url VARCHAR(2000) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  score DECIMAL(11,10) NOT NULL,
  model VARCHAR(100) NOT NULL,
  prompt VARCHAR(2000) NOT NULL,
  negative_prompt VARCHAR(2000) NOT NULL,
  steps TEXT NOT NULL,
  cfg_scale TEXT NOT NULL,
  seed INT NOT NULL,
  style_preset VARCHAR(50),
  sampler VARCHAR(255) NOT NULL,
  width INT NOT NULL,
  height INT NOT NULL
);