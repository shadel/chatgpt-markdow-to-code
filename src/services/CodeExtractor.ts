import { ICodeBlock } from '../interfaces/ICodeBlock';
import logger from '../utils/logger';

export class CodeExtractor {
  extract(markdown: string): ICodeBlock[] {
    logger.info('Starting to extract code blocks from markdown');
    const lines = markdown.split('\n');
    const codeBlocks: ICodeBlock[] = [];
    let currentFilePath: string | null = null;
    let currentLang: string | null = null;
    let currentCode: string[] = [];

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (currentLang) {
          // End of current code block
          if (currentFilePath) {
            codeBlocks.push({ path: currentFilePath, lang: currentLang, code: currentCode.join('\n') });
            logger.info(`Extracted code block: path=${currentFilePath}, lang=${currentLang}, lines=${currentCode.length}`);
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
          logger.info(`Found file path: ${currentFilePath} at line ${index + 1}`);
        }
      }
    });

    logger.info('Finished extracting code blocks from markdown');
    return codeBlocks;
  }
}
