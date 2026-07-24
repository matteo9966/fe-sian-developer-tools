# React Developer Tools Library - Deployment Guide

## Overview

This is a React library containing developer tools logic and components. It includes:
- **Modal Component**: A reusable modal dialog component
- **Utility Functions**: Helper functions for common tasks (validation, formatting, debouncing, etc.)

## Building the Library

### Development Build
To build the library for development:

```bash
npm run build
```

This will generate:
- `dist/index.js` - CommonJS format
- `dist/index.esm.js` - ES Module format
- `dist/index.d.ts` - TypeScript type definitions

### Watch Mode
For development with automatic rebuilding:

```bash
npm run dev
```

## Testing

### Run Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory with:
- `coverage/index.html` - HTML report (open in browser to view coverage visualization)
- `coverage/lcov.info` - LCOV format for CI/CD integration
- `coverage/coverage-summary.json` - JSON summary

## Publishing to NPM

### Prerequisites

1. **NPM Account**: Create an account at [npmjs.com](https://npmjs.com)
2. **Local Setup**: Login to npm locally:

```bash
npm login
```

Enter your NPM credentials when prompted.

### Pre-Publication Checklist

1. **Update Version**: Edit the `version` field in `package.json`
   ```json
   {
     "version": "0.1.0"
   }
   ```
   Follow [Semantic Versioning](https://semver.org/):
   - MAJOR: Breaking changes (e.g., 1.0.0 → 2.0.0)
   - MINOR: New features (e.g., 1.0.0 → 1.1.0)
   - PATCH: Bug fixes (e.g., 1.0.0 → 1.0.1)

2. **Update Documentation**: Update `README.md` with any changes

3. **Run Full Test Suite**:
   ```bash
   npm run test:coverage
   ```
   Ensure all tests pass and coverage is acceptable.

4. **Build the Library**:
   ```bash
   npm run build
   ```
   Verify the build completes without errors.

5. **Check Package Contents**:
   ```bash
   npm pack --dry-run
   ```
   This shows what files will be published.

### Publishing Steps

1. **Publish to NPM**:

```bash
npm publish
```

Or if using a scope (@greenaus):

```bash
npm publish --access public
```

**Note**: Scoped packages are private by default. Use `--access public` to make them public.

2. **Verify Publication**:

Visit `https://npmjs.com/package/@greenaus/sian-developer-tools` to verify your package is published.

### Automated Publishing (Recommended)

Create a GitHub Actions workflow (`.github/workflows/publish.yml`):

```yaml
name: Publish to NPM

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Build library
        run: npm run build
      
      - name: Publish to NPM
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Setup**:
1. Generate NPM token at [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens)
2. Add as GitHub secret `NPM_TOKEN`
3. Tag release on GitHub: `git tag v0.1.0 && git push origin v0.1.0`

## Using the Published Library

Once published, users can install your library:

```bash
npm install @greenaus/sian-developer-tools
```

### Usage Example

```typescript
// Modal component
import { Modal } from '@greenaus/sian-developer-tools';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="My Modal">
        <p>Modal content here</p>
      </Modal>
    </>
  );
}
```

```typescript
// Utility functions
import { validateEmail, debounce, formatDate } from '@greenaus/sian-developer-tools';

// Email validation
if (validateEmail('user@example.com')) {
  console.log('Valid email');
}

// Debouncing
const handleSearch = debounce((query: string) => {
  console.log('Searching for:', query);
}, 300);

// Date formatting
const formatted = formatDate(new Date());
```

## Troubleshooting

### Issue: `npm publish` fails with "Not authorized"

**Solution**: Run `npm login` and verify credentials.

### Issue: Package not found after publishing

**Solution**: 
- Verify scoped package is public: `npm view @greenaus/sian-developer-tools`
- May take a few minutes to appear in search results

### Issue: Build fails with TypeScript errors

**Solution**: 
- Run `npm run clean` to clear dist folder
- Run `npm install` to ensure all dependencies are installed
- Check `tsconfig.json` for compilation options

## Additional Resources

- [NPM Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Actions NPM Publishing](https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages)

## License

MIT
