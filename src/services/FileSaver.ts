import * as fs from 'fs';
import * as path from 'path';
import { ICodeBlock } from '../interfaces/ICodeBlock';

export class FileSaver {
  save(codeBlocks: ICodeBlock[], outputDir: string): void {
    codeBlocks.forEach((block) => {
      if (block.path && block.lang) {
        const filepath = path.join(outputDir, block.path);
        const dir = path.dirname(filepath);

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filepath, block.code, 'utf8');
        console.log(`Saved ${filepath}`);
      } else {
        console.warn(`Skipping code block due to missing path or language.`);
      }
    });
  }
}
