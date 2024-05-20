import * as fs from 'fs';
import * as path from 'path';
import { ICodeBlock } from '../interfaces/ICodeBlock';
import logger from '../utils/logger';

export class FileSaver {
  save(codeBlocks: ICodeBlock[], outputDir: string): void {
    logger.info(`Starting to save ${codeBlocks.length} code blocks to directory: ${outputDir}`);
    codeBlocks.forEach((block, index) => {
      if (block.path) {
        const filepath = path.join(outputDir, block.path);
        const dir = path.dirname(filepath);

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
          logger.info(`Created directory: ${dir}`);
        }

        fs.writeFileSync(filepath, block.code, 'utf8');
        logger.info(`Saved code block to ${filepath}`);
      } else {
        logger.warn(`Skipping code block at index ${index} due to missing path or language`);
      }
    });
    logger.info('Finished saving code blocks');
  }
}
