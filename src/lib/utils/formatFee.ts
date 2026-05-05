export function formatFee(fee: number | null | undefined, contactForFee: boolean): string {
  if (contactForFee) return 'Contact for Fee'
  if (!fee) return 'Contact for Fee'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(fee)
}
