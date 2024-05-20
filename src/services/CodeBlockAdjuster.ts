import { ICodeBlock } from '../interfaces/ICodeBlock';

export class CodeBlockAdjuster {
  adjust(codeBlocks: { filePath: string | null, language: string | null, code: string[] }[]): ICodeBlock[] {
    return codeBlocks.map(block => {
      const { filePath, language, code } = block;
      if (!filePath) return null;

      const baseIndentation = code[0].match(/^\s*/)?.[0] || '';
      const adjustedCode = code.map(line => line.startsWith(baseIndentation) ? line.slice(baseIndentation.length) : line).join('\n');

      return { path: filePath, lang: language, code: adjustedCode };
    }).filter(block => block !== null) as ICodeBlock[];
  }
}
