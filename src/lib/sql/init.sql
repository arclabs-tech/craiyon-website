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
  seed BIGINT NOT NULL,
  style_preset VARCHAR(50),
  sampler VARCHAR(255) NOT NULL,
  width INT NOT NULL,
  height INT NOT NULL
);

CREATE TABLE text_entries (
  id SERIAL PRIMARY KEY,
  text_id INT NOT NULL,
  team_name VARCHAR(128) NOT NULL,
  generation TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  score DECIMAL(12, 10) NOT NULL,
  model VARCHAR(64) NOT NULL,
  user_prompt TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  temperature DECIMAL(4, 3) NOT NULL,
  max_tokens INT NOT NULL
);