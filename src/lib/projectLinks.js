export const getSafeWebUrl = (value) => {
  if (typeof value !== 'string') return null

  const trimmedValue = value.trim()
  const hasControlCharacters = Array.from(trimmedValue).some((character) => {
    const codePoint = character.codePointAt(0)
    return codePoint < 32 || codePoint === 127
  })
  if (!/^https?:\/\//i.test(trimmedValue) || hasControlCharacters) {
    return null
  }

  try {
    const parsedUrl = new URL(trimmedValue)
    if (
      !['http:', 'https:'].includes(parsedUrl.protocol) ||
      !parsedUrl.hostname ||
      parsedUrl.username ||
      parsedUrl.password
    ) {
      return null
    }

    return parsedUrl.href
  } catch {
    return null
  }
}
