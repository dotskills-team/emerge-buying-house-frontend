import { describe, expect, it } from 'vitest';
import { cloudinaryLoader, optimizeArticleImages, previewUrl } from './media';

const SRC = 'https://res.cloudinary.com/demo/image/upload/v1/blog/a.jpg';

describe('cloudinaryLoader', () => {
  it('asks the CDN for the right width in the best format', () => {
    expect(cloudinaryLoader({ src: SRC, width: 640 })).toBe(
      'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,c_limit,w_640/v1/blog/a.jpg',
    );
    expect(cloudinaryLoader({ src: SRC, width: 640, quality: 90 })).toContain('q_90,');
  });
});

describe('previewUrl', () => {
  it('leaves images from elsewhere untouched', () => {
    expect(previewUrl('https://example.com/a.jpg')).toBe('https://example.com/a.jpg');
    expect(previewUrl(SRC)).toContain(',w_1200/v1/blog/a.jpg');
  });
});

describe('optimizeArticleImages', () => {
  it('serves article photos at reader size and keeps other attributes', () => {
    const out = optimizeArticleImages(`<p>x</p><img src="${SRC}" alt="Cutting" loading="lazy" />`);
    expect(out).toContain('alt="Cutting" loading="lazy"');
    expect(out).toContain('srcset="');
    expect(out).toContain('c_limit,w_1080/v1/blog/a.jpg"');
    expect(out).toContain('w_480/v1/blog/a.jpg 480w');
    expect(out).not.toContain(`src="${SRC}"`);
  });

  it('does not touch images that are not on the CDN', () => {
    const html = '<img src="https://example.com/a.jpg" alt="" />';
    expect(optimizeArticleImages(html)).toBe(html);
  });
});
