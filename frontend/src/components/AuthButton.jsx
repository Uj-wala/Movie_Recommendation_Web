function AuthButton({ children, href, icon, onClick, variant = 'outline' }) {
  const baseClasses =
    'inline-flex h-[34px] items-center justify-center rounded-[4px] border px-[18px] text-[13px] font-[700] leading-none transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

  const variantClasses =
    variant === 'solid'
      ? 'min-w-[88px] border-brand bg-brand text-white shadow-none hover:bg-brand-dark'
      : 'min-w-[107px] border-brand/70 bg-transparent text-[#188348] hover:bg-white/45'

  const classes = `${baseClasses} ${variantClasses}`

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {icon}
        {children}
      </button>
    )
  }

  return (
    <a href={href} className={classes}>
      {icon}
      {children}
    </a>
  )
}

export default AuthButton
