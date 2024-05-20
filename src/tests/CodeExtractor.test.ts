import { CodeExtractor } from '../services/CodeExtractor';
import { ICodeBlock } from '../interfaces/ICodeBlock';
import logger from '../utils/logger';

jest.mock('../utils/logger');

describe('CodeExtractor', () => {
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

  it('should extract code blocks with file paths and languages', () => {
    const markdown = `
Here is some JavaScript code:

**scripts/hello.js**:
\`\`\`javascript
console.log('Hello, world!');
\`\`\`

Here is some Python code:

**scripts/hello.py**:
\`\`\`python
print('Hello, world!')
\`\`\`
    `;

    const expectedCodeBlocks: ICodeBlock[] = [
      {
        path: 'scripts/hello.js',
        lang: 'javascript',
        code: "console.log('Hello, world!');"
      },
      {
        path: 'scripts/hello.py',
        lang: 'python',
        code: "print('Hello, world!')"
      }
    ];

    const codeBlocks = codeExtractor.extract(markdown.trim());
    expect(codeBlocks).toEqual(expectedCodeBlocks);
  });

  it('should skip code blocks without file paths', () => {
    const markdown = `
\`\`\`javascript
console.log('Hello, world!');
\`\`\`

**scripts/hello.py**:
\`\`\`python
print('Hello, world!')
\`\`\`
    `;

    const expectedCodeBlocks: ICodeBlock[] = [
      {
        path: 'scripts/hello.py',
        lang: 'python',
        code: "print('Hello, world!')"
      }
    ];

    const codeBlocks = codeExtractor.extract(markdown.trim());
    expect(codeBlocks).toEqual(expectedCodeBlocks);
  });

  it('should assign "unknown" as language if language is not specified', () => {
    const markdown = `
**scripts/hello.txt**:
\`\`\`
This is a plain text file.
\`\`\`
    `;

    const expectedCodeBlocks: ICodeBlock[] = [
      {
        path: 'scripts/hello.txt',
        lang: 'unknown',
        code: "This is a plain text file."
      }
    ];

    const codeBlocks = codeExtractor.extract(markdown.trim());
    expect(codeBlocks).toEqual(expectedCodeBlocks);
  });
});
