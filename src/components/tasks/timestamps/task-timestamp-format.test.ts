import { describe, expect, it } from 'vitest';
import { formatTaskDate, formatTaskTimestamp } from './task-timestamp-format';

describe('formatTaskDate', () => {
  it('returns "-" for undefined', () => {
    expect(formatTaskDate()).toBe('-');
  });

  it('returns "-" for empty string', () => {
    expect(formatTaskDate('')).toBe('-');
  });

  it('returns "-" for invalid date', () => {
    expect(formatTaskDate('not-a-date')).toBe('-');
  });

  it('formats a date in the current year without year', () => {
    const currentYear = new Date().getFullYear();
    const result = formatTaskDate(`${currentYear}-03-15`);
    expect(result).toBe('Mar 15');
  });

  it('formats a date in a different year with year', () => {
    const result = formatTaskDate('2020-06-15');
    expect(result).toBe('Jun 2020');
  });

  it('accepts a Date object', () => {
    const result = formatTaskDate(new Date('2020-01-01'));
    expect(result).toBe('Jan 2020');
  });

  it('accepts a numeric timestamp', () => {
    const result = formatTaskDate(new Date('2020-07-04').getTime());
    expect(result).toBe('Jul 2020');
  });
});

describe('formatTaskTimestamp', () => {
  it('returns "-" for undefined', () => {
    expect(formatTaskTimestamp()).toBe('-');
  });

  it('returns "-" for empty string', () => {
    expect(formatTaskTimestamp('')).toBe('-');
  });

  it('returns "-" for invalid date', () => {
    expect(formatTaskTimestamp('invalid')).toBe('-');
  });

  it('includes date and time parts', () => {
    const result = formatTaskTimestamp('2025-03-15T14:30:45Z');
    // Should contain month, day, year and time
    expect(result).toMatch(/Mar/);
    expect(result).toMatch(/15/);
    expect(result).toMatch(/2025/);
    expect(result).toMatch(/\d{1,2}:\d{2}:\d{2}\s*(AM|PM)/);
  });
});
