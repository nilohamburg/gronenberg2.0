"use client"

import type React from "react"

import type { ReactNode } from "react"

interface ScrollToProps {
  targetId: string
  children: ReactNode
  className?: string
}

export function ScrollTo({ targetId, children, className }: ScrollToProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <a href={`#${targetId}`} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}

