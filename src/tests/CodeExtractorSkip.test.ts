import { CodeExtractor } from '../services/CodeExtractor';
import { ICodeBlock } from '../interfaces/ICodeBlock';
import logger from '../utils/logger';

jest.mock('../utils/logger');

describe('CodeExtractor - Skip Tests', () => {
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

  it('should skip irrelevant lines', () => {
    const markdown = `
    Here is some JavaScript code:

    1. **Directory Structure**:
    \`\`\`javascript
    console.log('Hello, world!');
    \`\`\`

    Here is some Python code:

    2. **scripts/hello.py**:
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
});
