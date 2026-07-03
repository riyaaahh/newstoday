import Sanscript from '@indic-transliteration/sanscript'
import anyAscii from 'any-ascii'

const stripDiacritics = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '')

/**
 * Produce an ASCII, URL-safe slug for both categories and articles.
 *
 * Malayalam is transliterated (Sanscript → IAST, diacritics stripped, chillu
 * letters romanized via any-ascii) so slugs never contain non-ASCII characters.
 * Percent-encoded Malayalam slugs were 404-ing (normalization mismatch between
 * the stored slug and the URL param). English/Latin input passes through.
 */
export const slugify = (input: string): string =>
  anyAscii(stripDiacritics(Sanscript.t(input, 'malayalam', 'iast')))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
