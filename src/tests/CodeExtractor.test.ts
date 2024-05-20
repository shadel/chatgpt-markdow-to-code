import { CodeExtractor } from '../services/CodeExtractor';
import { ICodeBlock } from '../interfaces/ICodeBlock';

describe('CodeExtractor', () => {
  let codeExtractor: CodeExtractor;

  beforeEach(() => {
    codeExtractor = new CodeExtractor();
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

  it('should skip code blocks without file paths or languages', () => {
    const markdown = `
    **scripts/hello.js**:
    \`\`\`
    console.log('Hello, world!');
    \`\`\`

    \`\`\`python
    print('Hello, world!')
    \`\`\`
    `;

    const expectedCodeBlocks: ICodeBlock[] = [
      {
        path: 'scripts/hello.js',
        lang: null,
        code: "console.log('Hello, world!');"
      }
    ];

    const codeBlocks = codeExtractor.extract(markdown.trim());
    expect(codeBlocks).toEqual(expectedCodeBlocks);
  });
});
