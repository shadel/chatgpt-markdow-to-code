import * as fs from 'fs';
import * as path from 'path';
import { FileSaver } from '../services/FileSaver';
import { ICodeBlock } from '../interfaces/ICodeBlock';
import logger from '../utils/logger';

jest.mock('fs');
jest.mock('../utils/logger');

describe('FileSaver', () => {
  let fileSaver: FileSaver;
  let existsSyncMock: jest.SpyInstance;
  let mkdirSyncMock: jest.SpyInstance;
  let writeFileSyncMock: jest.SpyInstance;
  let loggerInfoMock: jest.SpyInstance;
  let loggerWarnMock: jest.SpyInstance;
  let loggerErrorMock: jest.SpyInstance;

  beforeEach(() => {
    fileSaver = new FileSaver();

    existsSyncMock = jest.spyOn(fs, 'existsSync').mockImplementation((pathValue) => {
      return pathValue.toString().includes(path.join('output', 'scripts')) ? false : true;
    });
    mkdirSyncMock = jest.spyOn(fs, 'mkdirSync').mockReturnValue(undefined);
    writeFileSyncMock = jest.spyOn(fs, 'writeFileSync').mockReturnValue(undefined);

    loggerInfoMock = jest.spyOn(logger, 'info').mockImplementation(() => logger);
    loggerWarnMock = jest.spyOn(logger, 'warn').mockImplementation(() => logger);
    loggerErrorMock = jest.spyOn(logger, 'error').mockImplementation(() => logger);
  });

  afterEach(() => {
    existsSyncMock.mockRestore();
    mkdirSyncMock.mockRestore();
    writeFileSyncMock.mockRestore();
    loggerInfoMock.mockRestore();
    loggerWarnMock.mockRestore();
    loggerErrorMock.mockRestore();
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
    expect(logger.info).toHaveBeenCalledWith('Starting to save 2 code blocks to directory: output');
    expect(logger.info).toHaveBeenCalledWith(`Created directory: ${path.join('output', 'scripts')}`);
    expect(logger.info).toHaveBeenCalledWith(`Saved code block to ${path.join('output', 'scripts', 'hello.js')}`);
    expect(logger.info).toHaveBeenCalledWith(`Saved code block to ${path.join('output', 'scripts', 'hello.py')}`);
    expect(logger.info).toHaveBeenCalledWith('Finished saving code blocks');
  });

  it('should skip code blocks without file paths', () => {
    const codeBlocks: ICodeBlock[] = [
      {
        path: null,
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

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join('output', 'scripts', 'hello.py'),
      "print('Hello, world!')",
      'utf8'
    );
    expect(logger.warn).toHaveBeenCalledWith('Skipping code block at index 0 due to missing path or language');
  });
});
