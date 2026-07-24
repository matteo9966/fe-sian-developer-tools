import {
  validateEmail,
  formatDate,
  debounce,
  throttle,
  deepClone,
  deepMerge,
} from '../utils/helpers';

describe('Helper Utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('test+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('notanemail')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('should format date object correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toContain('January');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });

    it('should format date string correctly', () => {
      const formatted = formatDate('2024-01-15');
      expect(formatted).toContain('January');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('should call function after delay', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 300);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(300);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should cancel previous call if called again within delay', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 300);

      debouncedFn();
      jest.advanceTimersByTime(100);
      debouncedFn();
      jest.advanceTimersByTime(100);

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(200);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    jest.useRealTimers();
  });

  describe('throttle', () => {
    jest.useFakeTimers();

    it('should call function immediately and then throttle', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 300);

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(300);

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    jest.useRealTimers();
  });

  describe('deepClone', () => {
    it('should create a deep copy of an object', () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = deepClone(original);

      cloned.b.c = 3;
      expect(original.b.c).toBe(2);
    });

    it('should deep clone arrays', () => {
      const original = { items: [1, 2, { nested: 3 }] };
      const cloned = deepClone(original);

      cloned.items[2].nested = 99;
      expect(original.items[2].nested).toBe(3);
    });
  });

  describe('deepMerge', () => {
    it('should merge two objects', () => {
      const target = { a: 1, b: { c: 2 } };
      const source = { b: { d: 3 } };
      const result = deepMerge(target, source);

      expect(result).toEqual({ a: 1, b: { c: 2, d: 3 } });
    });

    it('should not mutate target object', () => {
      const target = { a: 1 };
      const source = { b: 2 };
      deepMerge(target, source);

      expect(target).toEqual({ a: 1 });
    });

    it('should override values from source', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3 };
      const result = deepMerge(target, source);

      expect(result).toEqual({ a: 1, b: 3 });
    });

    it('should handle deeply nested objects', () => {
      const target = { a: { b: { c: 1 } } };
      const source = { a: { b: { d: 2 } } };
      const result = deepMerge(target, source);

      expect(result).toEqual({ a: { b: { c: 1, d: 2 } } });
    });
  });
});
