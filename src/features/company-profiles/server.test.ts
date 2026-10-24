import { describe, expect, it } from 'vitest';
import { describeFileName } from './server';

describe('describeFileName', () => {
  it('turns a file name into a title and a language', () => {
    expect(describeFileName('company_profile_en_0806.pdf')).toEqual({
      title: 'Company Profile',
      language: 'English',
    });
    expect(describeFileName('Emerge-Knitwear-Capabilities-DE.pdf')).toEqual({
      title: 'Emerge Knitwear Capabilities',
      language: 'German',
    });
    expect(describeFileName('2026.pdf')).toEqual({ title: 'Company Profile', language: undefined });
  });
});
