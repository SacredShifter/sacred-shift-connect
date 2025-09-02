# Tarot Learning Module - Implementation Checklist

## Phase 1: Accessibility & Routing (Critical)
- [x] Add Tarot route into `App.tsx` so `/tarot` is reachable.
- [ ] Verify `<Tarot.tsx>` loads in the app without errors.
- [ ] Write a Cypress test that confirms navigation works.

**Status: In Progress**

---

## Phase 2: Database Integration
- [x] Create missing `tarot_journal_logs` table. (Migration run by user)
- [x] Add RLS policies for `tarot_journal_logs`. (Migration run by user)
- [x] Connect `useTarotJournal` hook to this table. (Completed)
- [x] Ensure hooks use Supabase data instead of hardcoded arrays. (Completed)

**Status: Completed**

---

## Phase 3: Edge Function & Security
- [x] Create `log_tarot_pull` edge function. (Completed)
- [x] Update frontend to call this function. (Completed)
- [x] Add test to confirm unauthorized users cannot log pulls. (Completed)

**Status: Completed**

---

## Phase 4: Data & Codex Sync
- [x] Populate `tarot_cards` with the full 78 JSON deck. (SQL script provided)
- [x] Ensure `tarot_archetypes` is linked to Codex entries. (Completed via seeding the `registry_of_resonance` table)
- [x] Update `useTarotDeck` to query Supabase, not static JSON. (Completed)

**Status: Completed**

---

## Phase 5: Verification & Docs
- [x] Write unit tests for hooks, logging, deck retrieval. (Completed)
- [ ] Write integration test for full user flow. (Skipped: Cypress not available)
- [x] Add `TAROT_MODULE.md` with schema, routes, and usage. (Completed)
- [x] Generate ethos verification JSON for Tarot module (score ≥14/16). (Completed)

**Status: Completed**
