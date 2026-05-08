import React from 'react'
import Link from 'next/link'

type RoundedSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
type ButtonVariant = 'filled' | 'outlined' | 'ghosted' | 'disabled'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  rounded?: RoundedSize
  textColor?: string
  bgColor?: string
  hoverBgColor?: string
  hoverTextColor?: string
  borderColor?: string
  href?: string
  children: React.ReactNode
}

const roundedClasses: Record<RoundedSize, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
}

export default function Button({
  variant = 'filled',
  rounded = 'md',
  textColor = 'text-custom-white',
  bgColor,
  hoverBgColor,
  hoverTextColor,
  borderColor = 'border-custom-teal',
  href,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'px-4 py-2 font-medium transition-all duration-300 inline-flex items-center justify-center'
  const roundedClass = roundedClasses[rounded]

  // Determine if button should be disabled based on variant or disabled prop
  const isDisabled = variant === 'disabled' || disabled

  // Build variant-specific classes
  let variantClasses = ''
  let finalBgColor = bgColor
  let finalTextColor = textColor
  let finalHoverBgColor = hoverBgColor
  let finalHoverTextColor = hoverTextColor

  switch (variant) {
    case 'filled':
      finalBgColor = bgColor || 'bg-custom-teal'
      finalTextColor = textColor || 'text-custom-white'
      finalHoverBgColor = hoverBgColor || 'hover:bg-custom-blue'
      variantClasses = `${finalBgColor} ${finalTextColor} ${finalHoverBgColor}`
      if (finalHoverTextColor) {
        variantClasses += ` ${finalHoverTextColor}`
      }
      break

    case 'outlined':
      finalBgColor = 'bg-transparent'
      finalTextColor = textColor || 'text-custom-teal'
      finalHoverBgColor = hoverBgColor || 'hover:bg-custom-teal'
      finalHoverTextColor = hoverTextColor || 'hover:text-custom-white'
      variantClasses = `${finalBgColor} ${finalTextColor} border-2 ${borderColor} ${finalHoverBgColor} ${finalHoverTextColor}`
      break

    case 'ghosted':
      finalBgColor = 'bg-transparent'
      finalTextColor = textColor || 'text-custom-teal'
      finalHoverBgColor = hoverBgColor || 'hover:bg-custom-blue'
      variantClasses = `${finalBgColor} ${finalTextColor} ${finalHoverBgColor}`
      if (finalHoverTextColor) {
        variantClasses += ` ${finalHoverTextColor}`
      }
      break

    case 'disabled':
      finalBgColor = bgColor || 'bg-custom-gray/50'
      finalTextColor = textColor || 'text-custom-gray/50'
      variantClasses = `${finalBgColor} ${finalTextColor} cursor-not-allowed opacity-60`
      break
  }

  const allClasses = `${baseClasses} ${roundedClass} ${variantClasses} ${className}`.trim()

  // If href is provided, render as Link, otherwise as button
  if (href && !isDisabled) {
    return (
      <Link href={href} className={allClasses}>
        {children}
      </Link>
    )
  }

  return (
    <button className={allClasses} disabled={isDisabled} {...props}>
      {children}
    </button>
  )
}

