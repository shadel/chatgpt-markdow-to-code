Here is the complete file and code structure of the tool, following the SOLID principles and including the necessary configurations for ESLint, Jest, Husky, and GitHub Actions.

### Project Structure

```
markdown-to-code/
├── .husky/
│   ├── pre-commit
├── .github/
│   ├── workflows/
│   │   ├── publish.yml
├── dist/
├── node_modules/
├── src/
│   ├── interfaces/
│   │   ├── ICodeBlock.ts
│   ├── services/
│   │   ├── CodeExtractor.ts
│   │   ├── FileSaver.ts
│   ├── tests/
│   │   ├── CodeExtractor.test.ts
│   │   ├── FileSaver.test.ts
│   ├── main.ts
├── .eslintrc.json
├── .eslintignore
├── jest.config.js
├── package.json
├── tsconfig.json
├── README.md
```

### Source Code

#### `src/interfaces/ICodeBlock.ts`

```typescript
export interface ICodeBlock {
  path: string | null;
  lang: string | null;
  code: string;
}
```

#### `src/services/CodeExtractor.ts`

```typescript
import { ICodeBlock } from '../interfaces/ICodeBlock';

export class CodeExtractor {
  extract(markdown: string): ICodeBlock[] {
    const lines = markdown.split('\n');
    const codeBlocks: ICodeBlock[] = [];
    let currentFilePath: string | null = null;
    let currentLang: string | null = null;
    let currentCode: string[] = [];

    lines.forEach((line) => {
      if (line.startsWith('```')) {
        if (currentLang) {
          // End of current code block
          codeBlocks.push({ path: currentFilePath, lang: currentLang, code: currentCode.join('\n') });
          currentLang = null;
          currentCode = [];
          currentFilePath = null;
        } else {
          // Start of new code block
          currentLang = line.replace('```', '').trim();
        }
      } else if (currentLang) {
        currentCode.push(line);
      } else {
        const filePathMatch = line.match(/^\*\*(.+?)\*\*:/);
        if (filePathMatch) {
          currentFilePath = filePathMatch[1].trim();
        }
      }
    });

    return codeBlocks;
  }
}
```

#### `src/services/FileSaver.ts`

```typescript
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
```

#### `src/main.ts`

```typescript
import * as fs from 'fs';
import * as minimist from 'minimist';
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
```

### Tests

#### `src/tests/CodeExtractor.test.ts`

```typescript
import { CodeExtractor } from '../services/CodeExtractor';
import { ICodeBlock } from '../interfaces/ICodeBlock';

describe('CodeExtractor', () => {
  let codeExtractor: CodeExtractor;

  beforeEach(() => {
    codeExtractor = new CodeExtractor();
  });

  it('should extract code blocks with file paths and languages', () => {
    const markdown = `
    Here is some JavaScript code:

    **scripts/hello.js**:
    \`\`\`javascript
    console.log('Hello, world!');
    \`\`\`

    Here is some Python code:

    **scripts/hello.py**:
    \`\`\`python
    print('Hello, world!')
    \`\`\`
    `;

    const expectedCodeBlocks: ICodeBlock[] = [
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

    const codeBlocks = codeExtractor.extract(markdown.trim());
    expect(codeBlocks).toEqual(expectedCodeBlocks);
  });

  it('should skip code blocks without file paths or languages', () => {
    const markdown = `
    **scripts/hello.js**:
    \`\`\`
    console.log('Hello, world!');
    \`\`\`

    \`\`\`python
    print('Hello, world!')
    \`\`\`
    `;

    const expectedCodeBlocks: ICodeBlock[] = [
      {
        path: 'scripts/hello.js',
        lang: null,
        code: "console.log('Hello, world!');"
      }
    ];

    const codeBlocks = codeExtractor.extract(markdown.trim());
    expect(codeBlocks).toEqual(expectedCodeBlocks);
  });
});
```

#### `src/tests/FileSaver.test.ts`

```typescript
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
```

### Configurations

#### `.eslintrc.json`

```json
{
  "env": {
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "airbnb-base"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "no-console": "off",
    "class-methods-use-this": "off"
  },
  "overrides": [
    {
      "files": ["*.ts"],
      "rules": {
        "no-undef": "off"
      }
    }
  ]
}
```

#### `.eslintignore`

```
dist/
node_modules/
```

#### `jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(spec|test).ts']
};
```

#### `package.json`

```json
{
  "name": "markdown-to-code",
  "version":

 "1.0.0",
  "description": "A tool to convert code blocks in markdown files to separate coding files.",
  "main": "dist/main.js",
  "scripts": {
    "build": "tsc",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "test": "jest",
    "prepare": "husky install",
    "prepublishOnly": "npm run build"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/your-username/your-repo.git"
  },
  "keywords": [],
  "author": "Your Name",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/your-username/your-repo/issues"
  },
  "homepage": "https://github.com/your-username/your-repo#readme",
  "devDependencies": {
    "typescript": "^4.0.0",
    "eslint": "^7.0.0",
    "@typescript-eslint/parser": "^4.0.0",
    "@typescript-eslint/eslint-plugin": "^4.0.0",
    "jest": "^26.0.0",
    "@types/jest": "^26.0.0",
    "ts-jest": "^26.0.0",
    "husky": "^6.0.0",
    "lint-staged": "^10.0.0"
  },
  "dependencies": {
    "marked": "^1.0.0",
    "minimist": "^1.0.0"
  },
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "eslint --fix",
      "jest --bail --findRelatedTests"
    ]
  }
}
```

#### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Husky Pre-commit Hook

#### `.husky/pre-commit`

```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

### GitHub Actions

#### `.github/workflows/publish.yml`

```yaml
name: Publish to npm

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'

    - name: Install dependencies
      run: npm install

    - name: Run tests
      run: npm test

    - name: Lint code
      run: npm run lint

    - name: Publish to npm
      run: npm publish
      env:
        NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### README

#### `README.md`

```markdown
# Markdown to Code Converter

A Node.js tool to convert code blocks in a markdown file to separate coding files. This tool extracts code blocks from a markdown file, saves them to specified file paths, and supports multiple programming languages.

## Features

- Extracts code blocks from markdown files.
- Saves code blocks to specified file paths.
- Supports multiple programming languages.
- Automatically fixes linting issues and runs tests before committing using Husky and Lint-Staged.
- Publishes the package to npm when a new release is created.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

## Usage

### Command Line

Run the tool using the following command:

```bash
node dist/main.js --file <markdown-file> --output <output-directory>
```

Example:

```bash
node dist/main.js --file example.md --output output
```

### Example Markdown File

```markdown
# Example Markdown

Here is some JavaScript code:

**scripts/hello.js**:
```javascript
console.log('Hello, world!');
```

Here is some Python code:

**scripts/hello.py**:
```python
print('Hello, world!')
```
```

## Development

### Build

To compile the TypeScript code to JavaScript:

```bash
npm run build
```

### Lint

To run ESLint:

```bash
npm run lint
```

To automatically fix linting issues:

```bash
npm run lint:fix
```

### Test

To run the test suite:

```bash
npm test
```

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bugfix (`git checkout -b my-new-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin my-new-feature`).
5. Create a new Pull Request.

## Publishing

This project uses GitHub Actions to automatically publish the package to npm when a new release is created. Ensure you have the `NPM_TOKEN` secret set up in your GitHub repository settings.

1. Create a new release on GitHub.
2. The GitHub Action will run tests, lint the code, and publish the package to npm.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

This structure ensures that your project follows best practices, including code quality checks, testing, and CI/CD for publishing the package to npm.