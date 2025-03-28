"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

// Entferne den Import des useLanguage-Hooks
// import { useLanguage } from "@/contexts/language-context"

export function Navbar() {
  // Verwende statische Texte statt des useLanguage-Hooks
  // const { language, setLanguage, t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect - completely separated from menu logic
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    handleScroll() // Check initial scroll position
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  // Entferne die toggleLanguage-Funktion, da wir keinen Sprachkontext mehr verwenden
  // const toggleLanguage = useCallback(() => {
  //   setLanguage(language === "DE" ? "EN" : "DE")
  // }, [language, setLanguage])

  // Explicit toggle function
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev)
  }, [])

  // Navigation items mit statischen Texten
  const navItems = [
    { label: "Startseite", href: "/" },
    { label: "Ferienhäuser", href: "/rooms" },
    { label: "Restaurant", href: "/dining" },
    { label: "Wellness", href: "/spa" },
    // { label: "Tagungen & Events", href: "/meetings" },
    // { label: "Über uns", href: "/about" },
    { label: "Fitnessstudio", href: "/fitness" },
    { label: "Kontakt", href: "/contact" },
  ]

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "bg-white/95 backdrop-blur-sm shadow-md py-1" : "bg-transparent py-2",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="relative z-10">
              <h1
                className={cn(
                  "font-playfair text-xl font-bold transition-colors",
                  scrolled || mobileMenuOpen ? "text-gray-900" : "text-white",
                )}
              >
                Gronenberger Mühle
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? scrolled
                        ? "text-primary"
                        : "text-white font-semibold"
                      : scrolled
                        ? "text-gray-700"
                        : "text-white",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Language Switcher - Entfernt, da wir keinen Sprachkontext mehr verwenden */}
              {/* <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "font-medium transition-colors p-1.5",
                  scrolled || mobileMenuOpen
                    ? "text-gray-700 hover:text-gray-900"
                    : "text-white hover:text-white hover:bg-white/10",
                )}
                onClick={toggleLanguage}
              >
                <Globe className="h-4 w-4 mr-1" />
                {language}
              </Button> */}

              {/* Book Now Button */}
              <Link href="/rooms">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground hidden sm:inline-flex"
                >
                  JETZT BUCHEN
                </Button>
              </Link>

              {/* Mobile Menu Button - Using plain HTML button for maximum reliability */}
              <button
                type="button"
                className={cn(
                  "inline-flex items-center justify-center p-2 rounded-md lg:hidden z-[9999]", // Extremely high z-index
                  "relative", // Make sure it's positioned
                  mobileMenuOpen ? "text-gray-900" : scrolled ? "text-gray-700" : "text-white",
                  "hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary",
                )}
                onClick={toggleMobileMenu}
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpen}
                style={{ position: "relative", zIndex: 9999 }} // Inline style as backup
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - With extremely high z-index */}
      <div
        className={cn(
          "fixed inset-0 bg-white z-[9000] lg:hidden", // Very high z-index
          mobileMenuOpen ? "block" : "hidden",
        )}
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          zIndex: 9000, // Inline style as backup
        }}
      >
        <div className="pt-20 px-4 pb-6 h-full overflow-y-auto">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "block py-3 px-2 text-lg font-medium border-b border-gray-100",
                  pathname === item.href ? "text-primary" : "text-gray-800",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Book Now Button */}
            <div className="pt-4">
              <Link href="/rooms" className="block w-full">
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  JETZT BUCHEN
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}

