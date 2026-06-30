/**
 * Unicode-aware slugify. Keeps Malayalam (and any Unicode) letters/numbers,
 * lowercases ASCII, and collapses whitespace to hyphens. Malayalam characters
 * stay intact — they are valid in URLs once percent-encoded and are good for SEO.
 */
export const slugify = (input: string): string =>
  input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
