import * as fs from 'fs';
import minimist from 'minimist';
import { CodeExtractor } from './services/CodeExtractor';
import { FileSaver } from './services/FileSaver';
import logger from './utils/logger';

// Get command line arguments
const args = minimist(process.argv.slice(2));

if (!args.file || !args.output) {
  logger.error('Usage: node dist/main.js --file <markdown-file> --output <output-directory>');
  process.exit(1);
}

const markdownFile: string = args.file;
const outputDir: string = args.output;

try {
  const markdown = fs.readFileSync(markdownFile, 'utf8');
  logger.info(`Read markdown file: ${markdownFile}`);

  const codeExtractor = new CodeExtractor();
  const fileSaver = new FileSaver();

  const codeBlocks = codeExtractor.extract(markdown);
  fileSaver.save(codeBlocks, outputDir);

  logger.info('Successfully processed the markdown file');
} catch (error) {
  logger.error(`Failed to process the markdown file: ${(error as Error).message}`);
  process.exit(1);
}
