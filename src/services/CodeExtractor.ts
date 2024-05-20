import { ICodeBlock } from '../interfaces/ICodeBlock';

export class CodeExtractor {
  extract(markdown: string): ICodeBlock[] {
    const lines = markdown.split('\n');
    const codeBlocks: ICodeBlock[] = [];
    let currentFilePath: string | null = null;
    let currentLang: string | null = null;
    let currentCode: string[] = [];

    lines.forEach((line) => {
      if (line.startsWith('```')) {
        if (currentLang) {
          // End of current code block
          if (currentFilePath) {
            codeBlocks.push({ path: currentFilePath, lang: currentLang, code: currentCode.join('\n') });
          }
          currentLang = null;
          currentCode = [];
          currentFilePath = null;
        } else {
          // Start of new code block
          currentLang = line.replace('```', '').trim() || "unknown";
        }
      } else if (currentLang) {
        currentCode.push(line);
      } else {
        const filePathMatch = line.match(/^\*\*(.+?)\*\*:/);
        if (filePathMatch) {
          currentFilePath = filePathMatch[1].trim();
        }
      }
    });

    return codeBlocks;
  }
}
