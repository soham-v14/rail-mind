-- RailMind Database Schema

CREATE TABLE IF NOT EXISTS sections (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    radius DOUBLE PRECISION DEFAULT 500,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stations (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trains (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    lat DOUBLE PRECISION NOT NULL DEFAULT 0,
    lng DOUBLE PRECISION NOT NULL DEFAULT 0,
    speed DOUBLE PRECISION DEFAULT 0,
    status VARCHAR(20) DEFAULT 'on_time' CHECK (status IN ('on_time', 'delayed', 'critical')),
    delay_minutes INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(20) PRIMARY KEY,
    incident_type VARCHAR(50) NOT NULL,
    location VARCHAR(200) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT DEFAULT '',
    detected_objects JSONB DEFAULT '[]',
    risk_score DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    resolved BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS incidents (
    id VARCHAR(20) PRIMARY KEY,
    alert_id VARCHAR(20) REFERENCES alerts(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL,
    escalation_level VARCHAR(20) NOT NULL,
    summary TEXT NOT NULL,
    actions JSONB DEFAULT '[]',
    stakeholders JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    resolved BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS risk_logs (
    id SERIAL PRIMARY KEY,
    section_id VARCHAR(20) REFERENCES sections(id) ON DELETE SET NULL,
    risk_score DOUBLE PRECISION NOT NULL,
    risk_category VARCHAR(20) NOT NULL,
    top_factors JSONB DEFAULT '[]',
    recommendation TEXT DEFAULT '',
    weather_encoded INT DEFAULT 0,
    track_condition_encoded INT DEFAULT 0,
    crowd_density_encoded INT DEFAULT 0,
    train_speed_kmh DOUBLE PRECISION DEFAULT 0,
    is_night INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crowd_logs (
    id SERIAL PRIMARY KEY,
    station_id VARCHAR(20) REFERENCES stations(id) ON DELETE SET NULL,
    density VARCHAR(20) NOT NULL CHECK (density IN ('low', 'medium', 'high', 'critical')),
    count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_incidents_created_at ON incidents(created_at DESC);
CREATE INDEX idx_risk_logs_created_at ON risk_logs(created_at DESC);
CREATE INDEX idx_trains_status ON trains(status);
