-- Neurithm Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Leads table (primary CRM)
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  company TEXT DEFAULT '',
  role TEXT DEFAULT '',
  industry TEXT DEFAULT '',
  company_size TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  source TEXT NOT NULL DEFAULT 'contact' CHECK (source IN ('assessment', 'calculator', 'whitepaper', 'contact', 'demo')),
  score INTEGER,
  assessment_data JSONB,
  calculator_data JSONB,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'closed_won', 'closed_lost')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deals table (pipeline management)
CREATE TABLE IF NOT EXISTS deals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  value DECIMAL(12, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  stage TEXT NOT NULL DEFAULT 'discovery' CHECK (stage IN ('discovery', 'strategy', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  service_type TEXT DEFAULT '' CHECK (service_type IN ('', 'consulting', 'agent_development', 'automation', 'training', 'managed_service')),
  expected_close_date DATE,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  template TEXT NOT NULL,
  subject TEXT NOT NULL,
  to_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'opened', 'clicked', 'bounced')),
  resend_id TEXT,
  metadata JSONB,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Whitepaper downloads (gated content tracking)
CREATE TABLE IF NOT EXISTS downloads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  resource_slug TEXT NOT NULL,
  resource_title TEXT NOT NULL,
  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT '',
  source TEXT DEFAULT 'blog',
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deals_lead_id ON deals(lead_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
CREATE INDEX IF NOT EXISTS idx_email_logs_lead_id ON email_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_downloads_email ON downloads(email);

-- Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Policies: Allow insert from anon (for lead capture forms)
CREATE POLICY "Allow anonymous lead creation" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous download tracking" ON downloads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous subscription" ON subscribers
  FOR INSERT WITH CHECK (true);

-- Policies: Allow service role full access (for API routes)
CREATE POLICY "Service role full access on leads" ON leads
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on deals" ON deals
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on email_logs" ON email_logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on downloads" ON downloads
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on subscribers" ON subscribers
  FOR ALL USING (auth.role() = 'service_role');
