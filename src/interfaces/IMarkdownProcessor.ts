export interface IMarkdownProcessor {
    process(markdown: string): { filePath: string | null, language: string | null, code: string[] }[];
  }