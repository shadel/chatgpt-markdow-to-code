import * as fs from 'fs';
import * as path from 'path';
import { FileSaver } from '../services/FileSaver';
import { ICodeBlock } from '../interfaces/ICodeBlock';

jest.mock('fs');

describe('FileSaver', () => {
  let fileSaver: FileSaver;

  beforeEach(() => {
    fileSaver = new FileSaver();
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.mkdirSync as jest.Mock).mockReturnValue(undefined);
    (fs.writeFileSync as jest.Mock).mockReturnValue(undefined);
  });

  it('should save code blocks to files', () => {
    const codeBlocks: ICodeBlock[] = [
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

    fileSaver.save(codeBlocks, 'output');

    expect(fs.mkdirSync).toHaveBeenCalledWith(path.join('output', 'scripts'), { recursive: true });
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join('output', 'scripts', 'hello.js'),
      "console.log('Hello, world!');",
      'utf8'
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join('output', 'scripts', 'hello.py'),
      "print('Hello, world!')",
      'utf8'
    );
  });

  it('should skip code blocks without file paths or languages', () => {
    const codeBlocks: ICodeBlock[] = [
      {
        path: null,
        lang: 'javascript',
        code: "console.log('Hello, world!');"
      },
      {
        path: 'scripts/hello.py',
        lang: null,
        code: "print('Hello, world!')"
      }
    ];

    fileSaver.save(codeBlocks, 'output');

    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });
});
