interface BadgeProps {
  variant: 'available' | 'unavailable' | 'limited' | 'featured' | 'draft' | 'published' | 'archived' | 'new' | 'read' | 'replied'
  children?: React.ReactNode
  label?: string
}

const styles: Record<string, string> = {
  available: 'bg-green-50 text-green-700 border border-green-200',
  unavailable: 'bg-gray-100 text-gray-600 border border-gray-200',
  limited: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  featured: 'text-white border border-yellow-400/60',
  draft: 'bg-gray-100 text-gray-600 border border-gray-200',
  published: 'bg-green-50 text-green-700 border border-green-200',
  archived: 'bg-gray-100 text-gray-500 border border-gray-200',
  new: 'bg-blue-50 text-blue-700 border border-blue-200',
  read: 'bg-gray-100 text-gray-600 border border-gray-200',
  replied: 'bg-green-50 text-green-700 border border-green-200',
}

const labels: Record<string, string> = {
  available: 'Available',
  unavailable: 'Unavailable',
  limited: 'Limited',
  featured: 'Featured',
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
  new: 'New',
  read: 'Read',
  replied: 'Replied',
}

export default function Badge({ variant, children, label }: BadgeProps) {
  const featuredStyle = variant === 'featured' ? { backgroundColor: '#C8A951', color: '#0B1F2A' } : {}

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[variant]}`}
      style={featuredStyle}
    >
      {children ?? label ?? labels[variant]}
    </span>
  )
}
