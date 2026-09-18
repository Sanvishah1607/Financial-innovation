-- =============================================================================
-- FinGuard Database Schema (Supabase PostgreSQL)
-- 
-- NOTE: This is the initial placeholder schema.
-- Run this in the Supabase SQL Editor when ready to integrate persistent storage.
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (User Metadata & Google OAuth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150),
    first_name VARCHAR(75),
    last_name VARCHAR(75),
    avatar_url TEXT,
    auth_provider VARCHAR(20) DEFAULT 'email', -- 'email' or 'google'
    google_id VARCHAR(150) UNIQUE,
    monthly_income NUMERIC(10, 2) DEFAULT 35000.00,
    currency VARCHAR(10) DEFAULT 'INR (₹)',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Transactions Table
-- TODO: Implement in Feature 1 (Expense Tracking)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(120) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    category VARCHAR(50) NOT NULL,
    transaction_date DATE NOT NULL,
    description TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Budgets Table
-- TODO: Implement in Feature 2 (Monthly Budget)
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    month_year VARCHAR(7) NOT NULL, -- Format: YYYY-MM (e.g. '2026-09')
    monthly_limit NUMERIC(10, 2) NOT NULL CHECK (monthly_limit > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Savings Goals Table
-- TODO: Implement in Feature 5 (Savings Calculator)
CREATE TABLE IF NOT EXISTS savings_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    goal_name VARCHAR(120) NOT NULL,
    target_amount NUMERIC(10, 2) NOT NULL CHECK (target_amount > 0),
    current_amount NUMERIC(10, 2) DEFAULT 0.00,
    target_months INT NOT NULL CHECK (target_months > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Fraud Awareness Logs Table (Optional / Educational)
-- TODO: Log educational fraud check stats without storing personal messages
CREATE TABLE IF NOT EXISTS fraud_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    risk_level VARCHAR(20),
    indicators_detected TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);
