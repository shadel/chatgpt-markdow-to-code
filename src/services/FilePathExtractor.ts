// src/services/FilePathExtractor.ts
export class FilePathExtractor {
    private filePathRegex = /(?:\*\*(\S+\.\S+)\*\*|`(\S+\.\S+)`)/;
    private fileExtensionRegex = /\.[a-z0-9]+$/i;
  
    extractFilePath(line: string): string | null {
      const filePathMatch = line.match(this.filePathRegex);
      if (filePathMatch) {
        const filePath = filePathMatch[1] || filePathMatch[2];
        if (filePath && this.fileExtensionRegex.test(filePath.trim())) {
          return filePath.trim();
        }
      }
      return null;
    }
  }
  