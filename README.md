# @greenaus/sian-developer-tools

A React library containing developer tools logic and components.

## Features

- 🎨 **Modal Component** - Reusable, accessible modal dialog component
- 🛠️ **Utility Functions** - Collection of helper functions
- 📦 **TypeScript Support** - Full TypeScript support with type definitions
- ✅ **Jest Testing** - Comprehensive test coverage with HTML reports
- 🚀 **Tree-shakeable** - ESM and CommonJS exports

## Installation

```bash
npm install @greenaus/sian-developer-tools
```

## Components

### Modal

A flexible modal component with built-in accessibility features.

```typescript
import { Modal } from '@greenaus/sian-developer-tools';
import { useState } from 'react';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Example Modal"
        closeOnEscape={true}
        closeOnOverlayClick={true}
      >
        <p>Your content here</p>
      </Modal>
    </>
  );
}
```

#### Modal Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Whether the modal is open |
| `onClose` | `() => void` | - | Callback when modal should close |
| `children` | `ReactNode` | - | Modal content |
| `title` | `string` | - | Optional modal title |
| `className` | `string` | - | Optional className for modal content |
| `overlayClassName` | `string` | - | Optional className for overlay |
| `closeOnEscape` | `boolean` | `true` | Close on escape key press |
| `closeOnOverlayClick` | `boolean` | `true` | Close when clicking overlay |

## Utilities

### validateEmail(email: string): boolean

Validates if a string is a valid email address.

```typescript
import { validateEmail } from '@greenaus/sian-developer-tools';

validateEmail('user@example.com'); // true
validateEmail('invalid'); // false
```

### formatDate(date: Date | string): string

Formats a date to a readable string.

```typescript
import { formatDate } from '@greenaus/sian-developer-tools';

formatDate(new Date('2024-01-15')); // "January 15, 2024"
```

### debounce<T>(func: T, delay: number): (...args: Parameters<T>) => void

Creates a debounced function that delays execution.

```typescript
import { debounce } from '@greenaus/sian-developer-tools';

const handleSearch = debounce((query: string) => {
  console.log('Searching:', query);
}, 300);

handleSearch('react'); // Called after 300ms
```

### throttle<T>(func: T, limit: number): (...args: Parameters<T>) => void

Creates a throttled function that limits execution frequency.

```typescript
import { throttle } from '@greenaus/sian-developer-tools';

const handleScroll = throttle(() => {
  console.log('Scroll event');
}, 1000);

window.addEventListener('scroll', handleScroll);
```

### deepClone<T>(obj: T): T

Creates a deep copy of an object.

```typescript
import { deepClone } from '@greenaus/sian-developer-tools';

const original = { a: { b: 1 } };
const cloned = deepClone(original);
cloned.a.b = 2;

console.log(original.a.b); // 1
```

### deepMerge<T>(target: T, source: Partial<T>): T

Deeply merges two objects.

```typescript
import { deepMerge } from '@greenaus/sian-developer-tools';

const target = { a: { b: 1 } };
const source = { a: { c: 2 } };
const result = deepMerge(target, source);

// result = { a: { b: 1, c: 2 } }
```

## Development

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Development with Watch

```bash
npm run dev
```

### Testing

Run tests:
```bash
npm test
```

Watch mode:
```bash
npm run test:watch
```

Coverage report:
```bash
npm run test:coverage
```

View coverage HTML report by opening `coverage/index.html` in your browser.

## Publishing

See [README-instructions.md](./README-instructions.md) for detailed publishing instructions.

Quick publish:
```bash
npm run prepublishOnly
npm publish --access public
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

TODO: fix     "prepublishOnly": "npm run clean && npm run build && npm run test:coverage"d