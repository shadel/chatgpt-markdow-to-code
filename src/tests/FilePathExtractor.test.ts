import { FilePathExtractor } from '../services/FilePathExtractor';

describe('FilePathExtractor', () => {
  let filePathExtractor: FilePathExtractor;

  beforeEach(() => {
    filePathExtractor = new FilePathExtractor();
  });

  it('should extract valid file paths', () => {
    const line = '**scripts/hello.js**:';
    expect(filePathExtractor.extractFilePath(line)).toEqual('scripts/hello.js');
  });

  it('should return null for invalid file paths', () => {
    const line = '1. **Directory Structure**:';
    expect(filePathExtractor.extractFilePath(line)).toBeNull();
  });

  it('should handle file paths with other leading characters', () => {
    const line = '2. **scripts/hello.py**:';
    expect(filePathExtractor.extractFilePath(line)).toEqual('scripts/hello.py');
  });

  it('should handle file paths with different prefixes', () => {
    const line = 'OtherPrefix **scripts/hello.py**:';
    expect(filePathExtractor.extractFilePath(line)).toEqual('scripts/hello.py');
  });

  it('should handle file paths with arbitrary leading text', () => {
    const line = 'Arbitrary leading text **scripts/hello.py**:';
    expect(filePathExtractor.extractFilePath(line)).toEqual('scripts/hello.py');
  });

  it('should handle file paths with ## prefix', () => {
    const line = '## **scripts/hello.py**:';
    expect(filePathExtractor.extractFilePath(line)).toEqual('scripts/hello.py');
  });

  it('should handle file paths with ### prefix', () => {
    const line = '### **scripts/hello.py**:';
    expect(filePathExtractor.extractFilePath(line)).toEqual('scripts/hello.py');
  });

  it('should handle file paths with #### prefix', () => {
    const line = '#### **scripts/hello.py**:';
    expect(filePathExtractor.extractFilePath(line)).toEqual('scripts/hello.py');
  });

  it('should return null for lines without file paths', () => {
    const line = 'This is not a file path line';
    expect(filePathExtractor.extractFilePath(line)).toBeNull();
  });
});
