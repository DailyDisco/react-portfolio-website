import { getSafeWebUrl } from './projectLinks'

describe('getSafeWebUrl', () => {
  test.each([
    [
      'https://example.com/project?demo=1#details',
      'https://example.com/project?demo=1#details',
    ],
    ['http://example.com', 'http://example.com/'],
    ['  HTTPS://example.com/project  ', 'https://example.com/project'],
    [
      'https://storage.example.com/image.png?token=public%2Fimage',
      'https://storage.example.com/image.png?token=public%2Fimage',
    ],
  ])('accepts an absolute web URL: %s', (value, expected) => {
    expect(getSafeWebUrl(value)).toBe(expected)
  })

  test.each([
    undefined,
    null,
    42,
    {},
    '',
    '   ',
    '/project',
    '//example.com/project',
    // eslint-disable-next-line no-script-url -- Malicious fixture verifies URL rejection.
    'javascript:alert(1)',
    'data:image/svg+xml,<svg></svg>',
    'blob:https://example.com/image',
    'ftp://example.com/file',
    'https:example.com',
    'https://',
    'https://username:password@example.com',
    'https://example.com/line\nbreak',
  ])('rejects an unsafe or malformed URL: %p', (value) => {
    expect(getSafeWebUrl(value)).toBeNull()
  })
})
