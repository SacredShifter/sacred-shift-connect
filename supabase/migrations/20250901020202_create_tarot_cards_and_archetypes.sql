-- Migration to create tarot_archetypes and tarot_cards tables

-- 1. Create the tarot_archetypes table
CREATE TABLE public.tarot_archetypes (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

-- 2. Create the tarot_cards table
CREATE TABLE public.tarot_cards (
    id INT PRIMARY KEY,
    title TEXT NOT NULL,
    arcana TEXT NOT NULL,
    suit TEXT NOT NULL,
    archetype_id INT REFERENCES public.tarot_archetypes(id),
    upright_keywords TEXT[] NOT NULL,
    reversed_keywords TEXT[] NOT NULL,
    keywords TEXT[] NOT NULL,
    color_above_primary TEXT NOT NULL,
    color_above_secondary TEXT NOT NULL,
    color_below_primary TEXT NOT NULL,
    color_below_secondary TEXT NOT NULL,
    sigil TEXT NOT NULL
);

-- 3. Enable RLS for the new tables
ALTER TABLE public.tarot_archetypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarot_cards ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for public read access
CREATE POLICY "Allow public read access to tarot archetypes"
ON public.tarot_archetypes
FOR SELECT
USING (true);

CREATE POLICY "Allow public read access to tarot cards"
ON public.tarot_cards
FOR SELECT
USING (true);

-- 5. Add comments for clarity
COMMENT ON TABLE public.tarot_archetypes IS 'Stores the archetypal concepts associated with each tarot card.';
COMMENT ON TABLE public.tarot_cards IS 'Stores the detailed data for each of the 78 tarot cards.';
COMMENT ON COLUMN public.tarot_cards.archetype_id IS 'Links to the primary archetype for the card in the tarot_archetypes table.';
