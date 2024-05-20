import { CodeExtractor } from '../services/CodeExtractor';
import { ICodeBlock } from '../interfaces/ICodeBlock';
import logger from '../utils/logger';

jest.mock('../utils/logger');

describe('CodeExtractor - File Path Tests', () => {
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

  it('should handle file paths starting with ####', () => {
    const markdown = `
    Here is some JavaScript code:

    #### **scripts/hello.js**:
    \`\`\`javascript
    console.log('Hello, world!');
    \`\`\`

    Here is some Python code:

    #### **scripts/hello.py**:
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

  it('should handle file paths starting with 2. ', () => {
    const markdown = `
    Here is some JavaScript code:

    2. **scripts/hello.js**:
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

  it('should handle file paths with other leading characters', () => {
    const markdown = `
    Here is some JavaScript code:

    OtherPrefix **scripts/hello.js**:
    \`\`\`javascript
    console.log('Hello, world!');
    \`\`\`

    Here is some Python code:

    OtherPrefix **scripts/hello.py**:
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
});
