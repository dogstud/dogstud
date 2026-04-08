import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variantStyles: Record<string, string> = {
  primary: 'text-white font-semibold hover:opacity-90 disabled:opacity-50',
  secondary:
    'bg-white text-gray-900 border border-gray-300 font-medium hover:bg-gray-50 disabled:opacity-50',
  ghost: 'bg-transparent text-gray-700 font-medium hover:bg-gray-100 disabled:opacity-50',
}

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm rounded',
  md: 'px-5 py-2.5 text-sm rounded-md',
  lg: 'px-6 py-3 text-base rounded-md',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, className = '', style, ...props }, ref) => {
    const primaryStyle = variant === 'primary' ? { backgroundColor: '#2F7D5C', ...style } : style

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        style={primaryStyle}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
