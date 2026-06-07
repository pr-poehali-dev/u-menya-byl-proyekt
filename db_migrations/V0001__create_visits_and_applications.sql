CREATE TABLE visits (
    id SERIAL PRIMARY KEY,
    visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    page VARCHAR(255) NOT NULL DEFAULT '/',
    referrer TEXT,
    user_agent TEXT,
    ip VARCHAR(100)
);

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    name VARCHAR(255),
    contact VARCHAR(255),
    message TEXT,
    has_files BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_visits_visited_at ON visits(visited_at);
CREATE INDEX idx_applications_submitted_at ON applications(submitted_at);
