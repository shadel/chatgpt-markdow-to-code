import { CodeBlockExtractor } from '../services/CodeBlockExtractor';

describe('CodeBlockExtractor', () => {
  let codeBlockExtractor: CodeBlockExtractor;

  beforeEach(() => {
    codeBlockExtractor = new CodeBlockExtractor();
  });

  it('should identify code block delimiters', () => {
    const line = '```javascript';
    expect(codeBlockExtractor.isCodeBlockDelimiter(line)).toBe(true);
  });

  it('should not identify non-code block delimiters', () => {
    const line = 'console.log("Hello, world!");';
    expect(codeBlockExtractor.isCodeBlockDelimiter(line)).toBe(false);
  });

  it('should extract language from code block delimiter', () => {
    const line = '```python';
    expect(codeBlockExtractor.getCodeBlockLanguage(line)).toEqual('python');
  });

  it('should return null for code block delimiter without language', () => {
    const line = '```';
    expect(codeBlockExtractor.getCodeBlockLanguage(line)).toBeNull();
  });

  it('should trim whitespace around language in code block delimiter', () => {
    const line = '```  javascript  ';
    expect(codeBlockExtractor.getCodeBlockLanguage(line)).toEqual('javascript');
  });
});
