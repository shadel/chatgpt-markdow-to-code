import { MarkdownProcessor } from '../services/MarkdownProcessor';
import logger from '../utils/logger';

jest.mock('../utils/logger');

describe('MarkdownProcessor', () => {
  let markdownProcessor: MarkdownProcessor;

  beforeEach(() => {
    markdownProcessor = new MarkdownProcessor();
    jest.spyOn(logger, 'info').mockImplementation(() => logger);
    jest.spyOn(logger, 'warn').mockImplementation(() => logger);
    jest.spyOn(logger, 'error').mockImplementation(() => logger);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should extract file paths and code blocks', () => {
    const markdown = `
**scripts/hello.js**:
\`\`\`javascript
console.log('Hello, world!');
\`\`\`
    `;

    const results = markdownProcessor.process(markdown.trim());

    expect(results).toEqual([
      {
        filePath: 'scripts/hello.js',
        language: 'javascript',
        code: ["console.log('Hello, world!');"]
      }
    ]);
  });

  it('should handle missing file paths', () => {
    const markdown = `
    \`\`\`javascript
    console.log('Hello, world!');
    \`\`\`
    `;

    const results = markdownProcessor.process(markdown.trim());

    expect(results).toEqual([]);
  });
});
