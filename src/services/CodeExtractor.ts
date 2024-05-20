import { MarkdownProcessor } from './MarkdownProcessor';
import { CodeBlockAdjuster } from './CodeBlockAdjuster';
import { ICodeBlock } from '../interfaces/ICodeBlock';

export class CodeExtractor {
  private markdownProcessor: MarkdownProcessor;
  private codeBlockAdjuster: CodeBlockAdjuster;

  constructor() {
    this.markdownProcessor = new MarkdownProcessor();
    this.codeBlockAdjuster = new CodeBlockAdjuster();
  }

  extract(markdown: string): ICodeBlock[] {
    const processedBlocks = this.markdownProcessor.process(markdown);
    return this.codeBlockAdjuster.adjust(processedBlocks);
  }
}
