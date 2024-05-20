import * as fs from 'fs';
import minimist from 'minimist';
import { CodeExtractor } from './services/CodeExtractor';
import { FileSaver } from './services/FileSaver';

// Get command line arguments
const args = minimist(process.argv.slice(2));

if (!args.file || !args.output) {
  console.error('Usage: node dist/main.js --file <markdown-file> --output <output-directory>');
  process.exit(1);
}

const markdownFile: string = args.file;
const outputDir: string = args.output;

const markdown = fs.readFileSync(markdownFile, 'utf8');
const codeExtractor = new CodeExtractor();
const fileSaver = new FileSaver();

const codeBlocks = codeExtractor.extract(markdown);
fileSaver.save(codeBlocks, outputDir);
