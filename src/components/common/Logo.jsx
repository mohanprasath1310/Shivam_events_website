// Elegant gold crown mark + stacked "SHIVAM / EVENTS" wordmark.
// size: 'sm' (mobile header / admin sidebar), 'md' (desktop navbar), 'lg' (footer)
const SIZES = {
  sm: { crown: 14, title: 'text-sm', subtitle: 'text-[9px] tracking-[0.25em]' },
  md: { crown: 16, title: 'text-lg', subtitle: 'text-[10px] tracking-[0.3em]' },
  lg: { crown: 20, title: 'text-2xl', subtitle: 'text-xs tracking-[0.35em]' },
}

function Crown({ size = 16, className = '' }) {
  return (
    <svg
      width={size}
      height={size * 0.75}
      viewBox="0 0 24 18"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 15.5 L1 6 L6.5 10 L12 3 L17.5 10 L23 6 L22 15.5 Z"
        fill="currentColor"
      />
      <rect x="1.5" y="15.5" width="21" height="2" rx="0.5" fill="currentColor" />
      <circle cx="12" cy="2" r="1.4" fill="currentColor" />
      <circle cx="1.2" cy="5.5" r="1.1" fill="currentColor" />
      <circle cx="22.8" cy="5.5" r="1.1" fill="currentColor" />
    </svg>
  )
}

export default function Logo({ size = 'md', dark = false, align = 'center', className = '' }) {
  const s = SIZES[size] || SIZES.md
  const textColor = dark ? 'text-white' : 'text-black'
  const alignClass = align === 'start' ? 'items-start' : 'items-center'

  return (
    <div className={`flex flex-col ${alignClass} leading-none ${className}`}>
      <Crown size={s.crown} className="text-gold mb-0.5" />
      <span className={`font-heading font-bold ${s.title} ${textColor}`}>SHIVAM</span>
      <span className={`font-heading font-medium ${s.subtitle} text-gold-dark -mt-0.5`}>
        EVENTS
      </span>
    </div>
  )
}
