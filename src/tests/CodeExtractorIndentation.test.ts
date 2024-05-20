import { CodeExtractor } from '../services/CodeExtractor';
import { ICodeBlock } from '../interfaces/ICodeBlock';
import logger from '../utils/logger';

jest.mock('../utils/logger');

describe('CodeExtractor - Indentation Tests', () => {
  let codeExtractor: CodeExtractor;

  beforeEach(() => {
    codeExtractor = new CodeExtractor();
    jest.spyOn(logger, 'info').mockImplementation(() => logger);
    jest.spyOn(logger, 'warn').mockImplementation(() => logger);
    jest.spyOn(logger, 'error').mockImplementation(() => logger);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should handle multi-line code blocks with consistent indentation', () => {
    const markdown = `
    **scripts/multi-line.js**:
    \`\`\`javascript
    function sayHello() {
        console.log('Hello, world!');
        console.log('This is a multi-line code block.');
    }
    sayHello();
    \`\`\`
    `;

    const expectedCodeBlocks: ICodeBlock[] = [
      {
        path: 'scripts/multi-line.js',
        lang: 'javascript',
        code: `function sayHello() {
    console.log('Hello, world!');
    console.log('This is a multi-line code block.');
}
sayHello();`
      }
    ];

    const codeBlocks = codeExtractor.extract(markdown.trim());
    expect(codeBlocks).toEqual(expectedCodeBlocks);
  });

  it('should handle multi-line code blocks with varying indentation', () => {
    const markdown = `
    **scripts/multi-line-varying.js**:
    \`\`\`javascript
    function sayHello() {
          console.log('Hello, world!');
      console.log('This line has less indentation.');
              console.log('This line has more indentation.');
    }
      sayHello();
    \`\`\`
    `;

    const expectedCodeBlocks: ICodeBlock[] = [
      {
        path: 'scripts/multi-line-varying.js',
        lang: 'javascript',
        code: `function sayHello() {
      console.log('Hello, world!');
  console.log('This line has less indentation.');
          console.log('This line has more indentation.');
}
  sayHello();`
      }
    ];

    const codeBlocks = codeExtractor.extract(markdown.trim());
    expect(codeBlocks).toEqual(expectedCodeBlocks);
  });
});
