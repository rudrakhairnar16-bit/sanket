import { describe, it, expect } from 'vitest';
import { textToSigns, hasSignMapping } from '@/lib/text-to-sign';

describe('textToSigns', () => {
  it('maps "help" to help sign', () => {
    const result = textToSigns('help');
    expect(result).not.toBeNull();
    expect(result?.signIds).toContain('help');
  });

  it('maps "please show your document" to multiple signs', () => {
    const result = textToSigns('Please show your document');
    expect(result).not.toBeNull();
    expect(result?.signIds.length).toBeGreaterThan(1);
  });

  it('returns null for unsupported phrase', () => {
    const result = textToSigns('quantum computing');
    expect(result).toBeNull();
  });

  it('is case insensitive', () => {
    const result = textToSigns('HELP');
    expect(result).not.toBeNull();
    expect(result?.signIds).toContain('help');
  });

  it('maps single-word phrases', () => {
    expect(textToSigns('hello')?.signIds).toContain('hello');
    expect(textToSigns('yes')?.signIds).toContain('yes');
    expect(textToSigns('no')?.signIds).toContain('no');
  });

  it('maps multi-word exact phrases', () => {
    const result = textToSigns('thank you');
    expect(result).not.toBeNull();
    expect(result?.signIds).toContain('thank-you');
  });

  it('maps "thanks" to thank-you', () => {
    const result = textToSigns('thanks');
    expect(result).not.toBeNull();
    expect(result?.signIds).toContain('thank-you');
  });

  it('returns correct reviewStatus', () => {
    const result = textToSigns('help');
    expect(result?.reviewStatus).toBe('draft');
  });
});

describe('hasSignMapping', () => {
  it('returns true for supported phrase', () => {
    expect(hasSignMapping('help')).toBe(true);
    expect(hasSignMapping('hello')).toBe(true);
    expect(hasSignMapping('thank you')).toBe(true);
  });

  it('returns false for unsupported phrase', () => {
    expect(hasSignMapping('quantum computing')).toBe(false);
  });

  it('is case insensitive', () => {
    expect(hasSignMapping('HELP')).toBe(true);
  });
});
