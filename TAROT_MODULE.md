# Tarot Learning Module Documentation

This document provides a technical overview of the Sacred Shifter Tarot Learning Module.

## 1. Database Schema

The module relies on three primary database tables.

### `public.tarot_archetypes`
Stores the core archetypal concepts associated with the tarot cards.

| Column | Type | Description |
|---|---|---|
| `id` | `SERIAL` | Primary key for the archetype. |
| `name` | `TEXT` | The unique name of the archetype (e.g., "The Resonance"). |
| `description`| `TEXT` | A brief description of the archetype's meaning. |

### `public.tarot_cards`
Stores the detailed data for each of the 78 cards in the deck.

| Column | Type | Description |
|---|---|---|
| `id` | `INT` | Primary key (0-77), representing the card's number. |
| `title` | `TEXT` | The name of the card (e.g., "The Sun"). |
| `arcana` | `TEXT` | The arcana type ("Major" or "Minor"). |
| `suit` | `TEXT` | The card's suit ("Major", "Dream", "Energy", "Truth", "Community"). |
| `archetype_id`| `INT` | Foreign key referencing `tarot_archetypes.id`. |
| `upright_keywords`| `TEXT[]` | An array of keywords for the upright meaning. |
| `reversed_keywords`|`TEXT[]` | An array of keywords for the reversed meaning. |
| `keywords` | `TEXT[]` | An array of general keywords for searching. |
| `color_above_primary`| `TEXT` | Hex color code for the "As Above" gradient start. |
| `color_above_secondary`| `TEXT` | Hex color code for the "As Above" gradient end. |
| `color_below_primary`| `TEXT` | Hex color code for the "So Below" gradient start. |
| `color_below_secondary`| `TEXT` | Hex color code for the "So Below" gradient end. |
| `sigil` | `TEXT` | A string identifier for the 3D sigil model. |

### `public.tarot_readings`
Stores user-specific journal entries for their card pulls. This was previously named `tarot_journal_logs`.

| Column | Type | Description |
|---|---|---|
| `id` | `UUID` | Primary key for the reading entry. |
| `user_id` | `UUID` | Foreign key referencing `auth.users.id`. |
| `card_id` | `INT` | The ID of the card that was pulled. |
| `orientation` | `TEXT` | The orientation of the card ("upright" or "reversed"). |
| `reflection` | `TEXT` | The user's personal notes or interpretation. |
| `created_at`| `TIMESTAMPTZ`| Timestamp of when the reading was logged. |

## 2. Routing

The Tarot Learning Module is accessible via the following route:

- **Path:** `/tarot`
- **Component:** `src/pages/Tarot.tsx`

This route is registered directly in `src/App.tsx` to ensure it is reachable.

## 3. Frontend Usage

The module is composed of several key components and hooks:

- **`useTarotDeck()`**: A React Query hook that fetches all 78 cards from the `tarot_cards` table and provides helper functions for searching, filtering, and getting random cards.
- **`useTarotJournal()`**: A hook that provides an `addLog` function to save a user's card reading to the `tarot_readings` table by invoking the `log-tarot-pull` edge function.
- **`<TarotCard />`**: A reusable component that renders a single tarot card with its unique "As Above, So Below" design and an animated 3D sigil.
- **`<TarotPage />`**: The main page component, which uses a tabbed interface to switch between three modes:
    - **Deck Browser**: View and search the entire deck.
    - **Study Mode**: View detailed information about a single card and write a journal reflection.
    - **Daily Pull**: Draw a random card for the day.

## 4. Backend Logic

- **`log-tarot-pull` Edge Function**: A Supabase edge function located at `supabase/functions/log-tarot-pull`. This function handles the secure insertion of tarot readings into the database. It authenticates the user via their JWT and inserts the reading data into the `tarot_readings` table. This provides a secure layer between the client and the database.
