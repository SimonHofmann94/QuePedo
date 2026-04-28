// Serialize a GrammarChapter into a Markdown-ish string for AI prompts.
// Lifted from mobile/services/grammarExercise.ts so script + edge
// function + future server actions can all share one definition.

import type { GrammarChapter } from './types'

const MAX_CHARS = 2000

export function serializeChapterContent(chapter: GrammarChapter): string {
  const parts: string[] = [`Chapter: ${chapter.title}`]

  for (const section of chapter.sections) {
    parts.push(`\n## ${section.title}`)
    for (const block of section.blocks) {
      switch (block.type) {
        case 'text':
          if (block.content) parts.push(block.content)
          break
        case 'rules':
          if (block.items) parts.push(block.items.map((r) => `- ${r}`).join('\n'))
          break
        case 'examples':
          if (block.examples) {
            parts.push(block.examples.map((e) => `${e.es} — ${e.en}`).join('\n'))
          }
          break
        case 'table':
          if (block.headers && block.rows) {
            parts.push(block.headers.join(' | '))
            parts.push(block.rows.map((r) => r.join(' | ')).join('\n'))
          }
          break
      }
    }
  }

  const full = parts.join('\n')
  return full.length > MAX_CHARS ? full.slice(0, MAX_CHARS) + '…' : full
}
