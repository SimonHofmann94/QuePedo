// The one grader for typed grammar answers — web and both mobile players.
//
// Deliberately NOT shared/utils/quiz.ts's checkAnswer: that one grades
// vocabulary translations, where stripping a leading article and accepting a
// substring is helpful. Both are wrong here — "habría" is not "habría viajado",
// and "la" is a legitimate whole answer in an article exercise.
//
// Accents stay significant: "hablara" (imperfect subjunctive, correct in a
// type-2 si-clause) and "hablará" (future, wrong there) differ only by the
// tilde.

export function normalizeGrammarAnswer(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[.,!?¿¡'"«»]/g, '')
    .replace(/\s+/g, ' ') // "había  ido" === "había ido"
    .trim()
}

/** True when `user` matches `correct` or any of `acceptable`. */
export function checkGrammarAnswer(
  user: string,
  correct: string,
  acceptable?: readonly string[],
): boolean {
  const u = normalizeGrammarAnswer(user)
  if (!u) return false
  return [correct, ...(acceptable ?? [])].some((c) => normalizeGrammarAnswer(c) === u)
}
