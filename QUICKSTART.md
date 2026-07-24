# Quick Start Guide

This guide will help you get started with the @greenaus/sian-developer-tools library.

## Installation

```bash
npm install @greenaus/sian-developer-tools
```

## Using the Modal Component

The Modal component is a flexible, accessible dialog component:

```typescript
import React, { useState } from 'react';
import { Modal } from '@greenaus/sian-developer-tools';

export function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        Open Modal
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Welcome"
      >
        <p>This is the modal content</p>
        <button onClick={() => setIsOpen(false)}>Close</button>
      </Modal>
    </div>
  );
}
```

### Modal Features

- **Accessible**: Follows ARIA standards with proper roles and attributes
- **Keyboard Support**: Press Escape to close (if enabled)
- **Click Outside**: Click on overlay to close (if enabled)
- **Body Scroll Lock**: Automatically prevents scrolling when modal is open

## Using Utility Functions

### Email Validation

```typescript
import { validateEmail } from '@greenaus/sian-developer-tools';

const isValid = validateEmail('user@example.com');
```

### Date Formatting

```typescript
import { formatDate } from '@greenaus/sian-developer-tools';

const formatted = formatDate(new Date());
// Output: "July 24, 2024"
```

### Debouncing

Debounce is useful for search inputs, window resize, etc.

```typescript
import { debounce } from '@greenaus/sian-developer-tools';

const handleSearch = debounce((query: string) => {
  // Make API call
  console.log('Searching for:', query);
}, 300);

// This will only call the function 300ms after the last call
<input onChange={(e) => handleSearch(e.target.value)} />
```

### Throttling

Throttle is useful for scroll events, resize handlers, etc.

```typescript
import { throttle } from '@greenaus/sian-developer-tools';

const handleScroll = throttle(() => {
  console.log('User scrolled');
}, 1000);

window.addEventListener('scroll', handleScroll);
```

### Deep Clone

```typescript
import { deepClone } from '@greenaus/sian-developer-tools';

const original = { user: { name: 'John', details: { age: 30 } } };
const copy = deepClone(original);

copy.user.details.age = 31;
console.log(original.user.details.age); // Still 30
```

### Deep Merge

```typescript
import { deepMerge } from '@greenaus/sian-developer-tools';

const config1 = { 
  theme: { 
    colors: { primary: 'blue' }
  }
};

const config2 = { 
  theme: { 
    colors: { secondary: 'red' }
  }
};

const merged = deepMerge(config1, config2);
// merged.theme.colors = { primary: 'blue', secondary: 'red' }
```

## Styling the Modal

The Modal component uses simple class names that you can style:

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  font-size: 18px;
  font-weight: bold;
}

.modal-body {
  padding: 20px;
}
```

## TypeScript Support

All components and utilities are fully typed:

```typescript
import type { ModalProps } from '@greenaus/sian-developer-tools';

// Full type support for props
const modalProps: ModalProps = {
  isOpen: true,
  onClose: () => {},
  title: 'Example',
  children: <div>Content</div>,
};
```

## Testing

The library is tested with Jest. Run tests with:

```bash
npm test
```

View coverage report:

```bash
npm run test:coverage
```

Open `coverage/index.html` in your browser to see a detailed coverage report.

## Need Help?

- Check [README.md](./README.md) for API documentation
- Check [README-instructions.md](./README-instructions.md) for deployment instructions
