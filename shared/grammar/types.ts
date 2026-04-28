export interface GrammarContentBlock {
  type: 'text' | 'rules' | 'examples' | 'table'
  content?: string
  items?: string[]
  examples?: { es: string; en: string }[]
  headers?: string[]
  rows?: string[][]
}

export interface GrammarSection {
  id: string
  title: string
  blocks: GrammarContentBlock[]
}

export interface GrammarChapter {
  id: number
  title: string
  sections: GrammarSection[]
}

export interface GrammarLevel {
  level: string
  title: string
  chapters: GrammarChapter[]
}
