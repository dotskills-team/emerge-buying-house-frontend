import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { linkify } from './linkify';

afterEach(cleanup);

describe('linkify', () => {
  it('links web addresses and emails, and keeps the rest as text', () => {
    render(
      <p>{linkify('Mail sales@emerge.com or see https://emerge.com/production. <b>x</b>')}</p>,
    );
    expect(screen.getByRole('link', { name: 'sales@emerge.com' }).getAttribute('href')).toBe(
      'mailto:sales@emerge.com',
    );
    // The full stop after the address is not part of it.
    expect(screen.getByRole('link', { name: 'https://emerge.com/production' })).toBeTruthy();
    expect(document.querySelector('b')).toBeNull(); // markup stays text
  });
});
