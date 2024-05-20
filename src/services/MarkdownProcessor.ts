import logger from '../utils/logger';
import { ICodeBlock } from '../interfaces/ICodeBlock';

export class MarkdownProcessor {
  process(markdown: string): { filePath: string | null, language: string | null, code: string[] }[] {
    logger.info('Starting to process markdown');
    const lines = markdown.split('\n');
    const results: { filePath: string | null, language: string | null, code: string[] }[] = [];
    let currentFilePath: string | null = null;
    let currentLang: string | null = null;
    let currentCode: string[] = [];
    let insideCodeBlock = false;

    lines.forEach((line, index) => {
      if (line.trim().startsWith('```')) {
        if (insideCodeBlock) {
          // End of current code block
          insideCodeBlock = false;
          results.push({ filePath: currentFilePath, language: currentLang, code: currentCode });
          currentLang = null;
          currentCode = [];
          currentFilePath = null;
        } else {
          // Start of new code block
          insideCodeBlock = true;
          currentLang = line.trim().replace('```', '').trim() || 'unknown';
        }
      } else if (insideCodeBlock) {
        currentCode.push(line);
      } else {
        const filePathMatch = line.match(/^\s*(\*\*|####)\s*(.+?)\s*\*\*:/);
        if (filePathMatch) {
          currentFilePath = filePathMatch[2].trim();
          logger.info(`Found file path: ${currentFilePath} at line ${index + 1}`);
        }
      }
    });

    logger.info('Finished processing markdown');
    return results;
  }
}
