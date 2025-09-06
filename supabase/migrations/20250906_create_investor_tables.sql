-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE investor_type AS ENUM ('debt', 'equity', 'grant', 'hybrid');
CREATE TYPE investor_stage AS ENUM ('pre_seed', 'seed', 'series_a', 'series_b', 'series_c', 'growth', 'late_stage');
CREATE TYPE engagement_status AS ENUM ('not_contacted', 'initial_outreach', 'in_discussion', 'due_diligence', 'term_sheet', 'closed_deal', 'passed', 'no_response');
CREATE TYPE engagement_type AS ENUM ('email', 'call', 'meeting', 'conference', 'introduction', 'follow_up', 'document_shared');

-- Create investors table
CREATE TABLE investors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type investor_type NOT NULL,
    website VARCHAR(500),
    description TEXT,
    investment_size_min BIGINT,
    investment_size_max BIGINT,
    regions TEXT[] DEFAULT '{}',
    sectors TEXT[] DEFAULT '{}',
    stage_focus investor_stage[] DEFAULT '{}',
    portfolio_companies TEXT[] DEFAULT '{}',
    engagement_status engagement_status DEFAULT 'not_contacted',
    tags TEXT[] DEFAULT '{}',
    logo_url VARCHAR(500),
    founded_year INTEGER,
    aum BIGINT, -- Assets Under Management
    notable_investments TEXT[] DEFAULT '{}',
    investment_thesis TEXT,
    preferred_contact_method VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create investor_contacts table
CREATE TABLE investor_contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    linkedin VARCHAR(500),
    twitter VARCHAR(255),
    notes TEXT,
    is_primary BOOLEAN DEFAULT false,
    last_contacted TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create engagement_history table
CREATE TABLE engagement_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES investor_contacts(id) ON DELETE SET NULL,
    date TIMESTAMPTZ NOT NULL,
    type engagement_type NOT NULL,
    subject VARCHAR(500),
    notes TEXT,
    outcome VARCHAR(255),
    next_steps TEXT,
    attachments TEXT[] DEFAULT '{}',
    reminder_date TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create investor_documents table
CREATE TABLE investor_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    url VARCHAR(500) NOT NULL,
    file_size BIGINT,
    uploaded_by UUID REFERENCES auth.users(id),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create saved_searches table
CREATE TABLE saved_searches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    filters JSONB NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create investor_notes table for private notes
CREATE TABLE investor_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    is_private BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_investors_type ON investors(type);
CREATE INDEX idx_investors_engagement_status ON investors(engagement_status);
CREATE INDEX idx_investors_regions ON investors USING GIN(regions);
CREATE INDEX idx_investors_sectors ON investors USING GIN(sectors);
CREATE INDEX idx_investors_stage_focus ON investors USING GIN(stage_focus);
CREATE INDEX idx_investors_tags ON investors USING GIN(tags);
CREATE INDEX idx_investors_investment_size ON investors(investment_size_min, investment_size_max);
CREATE INDEX idx_investors_created_at ON investors(created_at DESC);
CREATE INDEX idx_investor_contacts_investor_id ON investor_contacts(investor_id);
CREATE INDEX idx_investor_contacts_email ON investor_contacts(email);
CREATE INDEX idx_engagement_history_investor_id ON engagement_history(investor_id);
CREATE INDEX idx_engagement_history_date ON engagement_history(date DESC);
CREATE INDEX idx_engagement_history_type ON engagement_history(type);

-- Enable full-text search
ALTER TABLE investors ADD COLUMN search_vector tsvector;

CREATE OR REPLACE FUNCTION update_investor_search_vector()
RETURNS trigger AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.investment_thesis, '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.sectors, ' '), '')), 'D') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_investor_search_vector_trigger
BEFORE INSERT OR UPDATE ON investors
FOR EACH ROW
EXECUTE FUNCTION update_investor_search_vector();

CREATE INDEX idx_investors_search_vector ON investors USING GIN(search_vector);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_investors_updated_at BEFORE UPDATE ON investors
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investor_contacts_updated_at BEFORE UPDATE ON investor_contacts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_engagement_history_updated_at BEFORE UPDATE ON engagement_history
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_searches_updated_at BEFORE UPDATE ON saved_searches
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investor_notes_updated_at BEFORE UPDATE ON investor_notes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic - to be refined based on requirements)
-- For now, authenticated users can see all investors but only edit their own
CREATE POLICY "Users can view all investors" ON investors
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert investors" ON investors
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own investors" ON investors
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own investors" ON investors
    FOR DELETE USING (auth.uid() = created_by);

-- Similar policies for other tables
CREATE POLICY "Users can view all contacts" ON investor_contacts
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage contacts" ON investor_contacts
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view engagement history" ON engagement_history
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage engagement history" ON engagement_history
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view documents" ON investor_documents
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage documents" ON investor_documents
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage their own saved searches" ON saved_searches
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own notes" ON investor_notes
    FOR ALL USING (auth.uid() = user_id);