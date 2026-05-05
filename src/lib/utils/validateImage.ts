const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export function validateImage(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, and WebP images are allowed.' }
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { valid: false, error: 'Image must be under 5MB.' }
  }
  return { valid: true }
}
