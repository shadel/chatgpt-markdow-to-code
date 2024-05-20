// src/services/FilePathExtractor.ts
export class FilePathExtractor {
    private filePathRegex = /^(?:\s*#+\s*|\s*.*?\s+)?\*\*(\S+\.\S+)\*\*:/;
    private fileExtensionRegex = /\.[a-z0-9]+$/i;
  
    extractFilePath(line: string): string | null {
      const filePathMatch = line.match(this.filePathRegex);
      if (filePathMatch && this.fileExtensionRegex.test(filePathMatch[1].trim())) {
        return filePathMatch[1].trim();
      }
      return null;
    }
  }
  