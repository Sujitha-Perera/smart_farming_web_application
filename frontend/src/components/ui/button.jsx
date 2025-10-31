import React from "react"

// Simple button variants function
const getButtonClasses = (variant = "default", size = "default") => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    default: "border border-gree bg-white hover:bg-gray-50",
    destructive: "bg-red-600 text-white hover:bg-red-700", 
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "hover:bg-gray-100",
    link: "text-blue-600 underline-offset-4 hover:underline"
  }
  
  const sizes = {
    default: "h-10 px-4 py-2 ",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10"
  }
  
  return `${baseClasses} ${variants[variant]} ${sizes[size]}`
}

const Button = React.forwardRef(({ 
  className = "", 
  variant, 
  size, 
  children,
  ...props 
}, ref) => {
  const buttonClasses = `${getButtonClasses(variant, size)} ${className}`
  
  return (
    <button
      ref={ref}
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export { Button }