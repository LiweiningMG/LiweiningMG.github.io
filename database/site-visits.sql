CREATE TABLE IF NOT EXISTS site_visits (
  id BIGSERIAL PRIMARY KEY,
  visitor_hash TEXT NOT NULL,
  visitor_day_hash TEXT NOT NULL UNIQUE,
  visit_date DATE NOT NULL,
  region TEXT NOT NULL DEFAULT '其他',
  first_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS site_visits_visit_date_idx ON site_visits (visit_date);
CREATE INDEX IF NOT EXISTS site_visits_region_idx ON site_visits (region);