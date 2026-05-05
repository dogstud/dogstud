export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function generateListingSlug(
  dogName: string,
  breed: string,
  state: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  const base = slugify(`${dogName}-${breed}-${state}`)
  const exists = await checkExists(base)
  if (!exists) return base

  for (let i = 2; i <= 100; i++) {
    const candidate = `${base}-${i}`
    const taken = await checkExists(candidate)
    if (!taken) return candidate
  }

  return `${base}-${Date.now()}`
}
