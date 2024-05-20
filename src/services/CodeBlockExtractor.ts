// src/services/CodeBlockExtractor.ts
export class CodeBlockExtractor {
    isCodeBlockDelimiter(line: string): boolean {
      return line.trim().startsWith('```');
    }
  
    getCodeBlockLanguage(line: string): string | null {
      return line.trim().replace('```', '').trim() || null;
    }
  }
  