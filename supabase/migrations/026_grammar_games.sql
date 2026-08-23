-- 026: Juegos — grammar-decision games (el_o_la, ser_estar, pasado, subjuntivo).
--
-- game_id is a text column with a CHECK (021), mirrored by the GAME_IDS tuple
-- in shared/games/types.ts. Adding a game means widening the CHECK here —
-- nothing else changes: award_tacos, the daily cap, RLS and the admin KPIs
-- are all game-agnostic.
--
-- DEPLOY NOTE: apply BEFORE shipping the new game pages. A result submitted
-- for an id not in the CHECK is rejected at insert and the player sees
-- "score not saved".
ALTER TABLE game_results DROP CONSTRAINT game_results_game_id_check;
ALTER TABLE game_results ADD CONSTRAINT game_results_game_id_check
  CHECK (game_id IN ('chili_rush', 'loteria', 'construye', 'el_o_la', 'ser_estar', 'pasado', 'subjuntivo'));
