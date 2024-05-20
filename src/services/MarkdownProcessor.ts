// src/services/MarkdownProcessor.ts
import { IMarkdownProcessor } from '../interfaces/IMarkdownProcessor';
import { ICodeBlock } from '../interfaces/ICodeBlock';
import { FilePathExtractor } from './FilePathExtractor';
import { CodeBlockExtractor } from './CodeBlockExtractor';
import logger from '../utils/logger';

export class MarkdownProcessor implements IMarkdownProcessor {
  private filePathExtractor: FilePathExtractor;
  private codeBlockExtractor: CodeBlockExtractor;

  constructor() {
    this.filePathExtractor = new FilePathExtractor();
    this.codeBlockExtractor = new CodeBlockExtractor();
  }

  process(markdown: string): { filePath: string | null, language: string | null, code: string[] }[] {
    logger.info('Starting to process markdown');
    const lines = markdown.split('\n');
    const results: { filePath: string | null, language: string | null, code: string[] }[] = [];
    let currentFilePath: string | null = null;
    let currentLang: string | null = null;
    let currentCode: string[] = [];
    let insideCodeBlock = false;

    lines.forEach((line, index) => {
      if (this.codeBlockExtractor.isCodeBlockDelimiter(line)) {
        if (insideCodeBlock) {
          // End of current code block
          insideCodeBlock = false;
          if (currentFilePath) {
            results.push({ filePath: currentFilePath, language: currentLang, code: currentCode });
          }
          currentLang = null;
          currentCode = [];
          currentFilePath = null;
        } else {
          // Start of new code block
          insideCodeBlock = true;
          currentLang = this.codeBlockExtractor.getCodeBlockLanguage(line) || 'unknown';
        }
      } else if (insideCodeBlock) {
        currentCode.push(line);
      } else {
        const filePath = this.filePathExtractor.extractFilePath(line);
        if (filePath) {
          currentFilePath = filePath;
          logger.info(`Found file path: ${currentFilePath} at line ${index + 1}`);
        }
      }
    });

    logger.info('Finished processing markdown');
    return results;
  }
}
