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
