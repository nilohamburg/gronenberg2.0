"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { Bed, UtensilsCrossed, Waves, Users, Info, Calendar, Star, Gift, ChevronRight, ChevronDown } from "lucide-react"

interface SuperMenuProps {
  scrolled?: boolean
}

export function SuperMenu({ scrolled = false }: SuperMenuProps) {
  const pathname = usePathname()
  const { t } = useLanguage()
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null)

  // Define menu sections
  const menuSections = [
    {
      id: "rooms",
      label: t("rooms"),
      icon: <Bed className="h-5 w-5" />,
      image: "/images/room-bg.jpg",
      description: "Experience unparalleled luxury in our meticulously designed accommodations.",
      featured: {
        title: "Presidential Suite",
        description: "Our most exclusive accommodation with panoramic views and private terrace.",
        link: "/rooms/presidential-suite",
      },
      links: [
        { href: "/rooms?capacity=2", label: "Alle Ferienhäuser", description: "Perfect for couples or solo travelers" },
        {
          href: "/rooms?capacity=4",
          label: "Familien Ferienhäuser",
          description: "Spacious accommodations for families",
        },
        {
          href: "/rooms?seaView=true",
          label: "Ferienhäuser mit Seeblick",
          description: "Breathtaking views of the water",
        },
        {
          href: "/rooms?dogsAllowed=true",
          label: "Ferienhäuser mit Hund",
          description: "Urlaub mit Hund an der Ostsee",
        },
      ],
    },
    {
      id: "dining",
      label: t("dining"),
      icon: <UtensilsCrossed className="h-5 w-5" />,
      image: "/images/restaurant-bg.jpg",
      description: "Savor exquisite cuisine prepared by our award-winning chefs.",
      featured: {
        title: "Chef's Table Experience",
        description: "An intimate dining experience with our Executive Chef.",
        link: "/dining/chefs-table",
      },
      links: [
        {
          href: "/dining#muhle-restaurant",
          label: "Mühle Restaurant",
          description: "Fine dining with local and international cuisine",
        },
        { href: "/dining#lounge", label: "The Lounge", description: "Casual dining and cocktails" },
        {
          href: "/dining#garden-terrace",
          label: "Garden Terrace",
          description: "Al fresco dining with scenic views",
        },
        { href: "/dining#wine-cellar", label: "Wine Cellar", description: "Exclusive wine tastings and pairings" },
      ],
    },
    {
      id: "spa",
      label: t("spa"),
      icon: <Waves className="h-5 w-5" />,
      image: "/images/spa-bg.jpg",
      description: "Rejuvenate your body and mind in our world-class spa facilities.",
      featured: {
        title: "Signature Wellness Journey",
        description: "A 3-hour comprehensive spa experience designed for total relaxation.",
        link: "/spa/signature-journey",
      },
      links: [
        { href: "/spa#treatments", label: "Spa Treatments", description: "Rejuvenating massages and therapies" },
        { href: "/spa#facilities", label: "Spa Facilities", description: "Pool, saunas, and relaxation areas" },
        { href: "/spa#packages", label: "Wellness Packages", description: "Comprehensive spa experiences" },
        { href: "/spa#fitness", label: "Fitness Center", description: "State-of-the-art equipment and classes" },
      ],
    },
    {
      id: "meetings",
      label: t("meetings"),
      icon: <Users className="h-5 w-5" />,
      image: "/images/meetings-bg.jpg",
      description: "Host unforgettable events in our elegant venues.",
      featured: {
        title: "Grand Ballroom",
        description: "Our largest venue, perfect for weddings and galas up to 300 guests.",
        link: "/meetings/grand-ballroom",
      },
      links: [
        { href: "/meetings#venues", label: "Event Venues", description: "Spaces for every occasion" },
        { href: "/meetings#weddings", label: "Weddings", description: "Create your perfect celebration" },
        {
          href: "/meetings#corporate",
          label: "Corporate Events",
          description: "Professional settings for business gatherings",
        },
        { href: "/meetings#packages", label: "Event Packages", description: "All-inclusive options for your event" },
      ],
    },
    {
      id: "about",
      label: t("about"),
      icon: <Info className="h-5 w-5" />,
      image: "/images/hero-bg.jpg",
      description: "Discover the rich history and heritage of Gronenberger Mühle.",
      featured: {
        title: "Our Sustainability Commitment",
        description: "Learn about our initiatives to protect the environment and support local communities.",
        link: "/about/sustainability",
      },
      links: [
        { href: "/about#story", label: "Our Story", description: "The history of Gronenberger Mühle" },
        { href: "/about#team", label: "Our Team", description: "Meet the people behind our service" },
        { href: "/contact", label: "Contact Us", description: "Get in touch with our team" },
        { href: "/about#location", label: "Location", description: "How to find us" },
      ],
    },
  ]

  // Special offers and promotions
  const specialOffers = [
    {
      title: "Summer Escape Package",
      description: "20% off stays of 3 nights or more",
      icon: <Sun className="h-5 w-5" />,
      link: "/offers/summer-escape",
    },
    {
      title: "Spa & Stay",
      description: "Includes a 60-minute massage per person",
      icon: <Gift className="h-5 w-5" />,
      link: "/offers/spa-stay",
    },
    {
      title: "Gourmet Experience",
      description: "5-course dinner with wine pairing",
      icon: <UtensilsCrossed className="h-5 w-5" />,
      link: "/offers/gourmet-experience",
    },
  ]

  return (
    <nav className="hidden lg:block">
      <ul className="flex space-x-6">
        <li className="relative">
          <Link
            href="/"
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-md",
              scrolled
                ? pathname === "/"
                  ? "text-primary"
                  : "text-gray-800 hover:text-gray-900"
                : pathname === "/"
                  ? "text-white"
                  : "text-white hover:text-white/80",
            )}
          >
            {t("home")}
          </Link>
        </li>

        {menuSections.map((section) => (
          <li
            key={section.id}
            className="relative"
            onMouseEnter={() => setActiveMenu(section.id)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <button
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-md",
                scrolled
                  ? pathname.includes(`/${section.id}`)
                    ? "text-primary"
                    : "text-gray-800 hover:text-gray-900"
                  : pathname.includes(`/${section.id}`)
                    ? "text-white"
                    : "text-white hover:text-white/80",
                activeMenu === section.id && (scrolled ? "text-primary" : "text-white"),
              )}
            >
              {section.label}
              <ChevronDown
                className={cn(
                  "ml-1 h-3.5 w-3.5 transition-transform duration-200",
                  activeMenu === section.id && "rotate-180",
                )}
              />
            </button>

            {/* Super Menu Dropdown */}
            {activeMenu === section.id && (
              <div className="absolute left-1/2 z-50 w-[95vw] max-w-6xl -translate-x-1/2" style={{ top: "100%" }}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden bg-[#14385a]/95 border rounded-lg shadow-xl border-gray-200/20 backdrop-blur-md text-white"
                >
                  <div className="grid grid-cols-12 gap-0">
                    {/* Featured Image */}
                    <div
                      className="relative col-span-3 overflow-hidden"
                      style={{
                        backgroundImage: `url(${section.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm"></div>
                      <div className="relative flex flex-col justify-end h-full p-6 text-white">
                        <div className="mb-2 text-3xl font-playfair">{section.label}</div>
                        <p className="mb-4 text-sm opacity-90">{section.description}</p>
                        <Link
                          href={`/${section.id}`}
                          className="inline-flex items-center text-sm font-medium text-white underline transition-colors underline-offset-4 hover:text-white/80"
                        >
                          {t("viewAll")}
                          <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </div>
                    </div>

                    {/* Main Links */}
                    <div className="col-span-5 p-8">
                      <h3 className="mb-4 text-lg font-medium text-white font-playfair">{t("explore")}</h3>
                      <ul className="grid grid-cols-2 gap-y-4 gap-x-8">
                        {section.links.map((link, idx) => (
                          <li key={idx}>
                            <Link
                              href={link.href}
                              className="group flex flex-col space-y-1 transition-colors hover:text-white/80"
                            >
                              <span className="text-sm font-medium">{link.label}</span>
                              <span className="text-xs text-gray-300 group-hover:text-white/60">
                                {link.description}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Featured Content & Special Offers */}
                    <div className="col-span-4 p-8 bg-[#0c2440]/80">
                      {/* Featured Content */}
                      <div className="mb-8">
                        <h3 className="mb-3 text-lg font-medium text-white font-playfair">{t("featured")}</h3>
                        <div className="p-4 transition-colors bg-[#14385a]/80 rounded-lg shadow-sm hover:shadow border border-white/10">
                          <Link href={section.featured.link} className="group block">
                            <h4 className="mb-1 text-sm font-medium text-white group-hover:text-white/80">
                              {section.featured.title}
                            </h4>
                            <p className="text-xs text-gray-300">{section.featured.description}</p>
                            <div className="flex items-center mt-2 text-xs font-medium text-white">
                              {t("discoverMore")}
                              <ChevronRight className="w-3 h-3 ml-1" />
                            </div>
                          </Link>
                        </div>
                      </div>

                      {/* Special Offers */}
                      <div>
                        <h3 className="mb-3 text-lg font-medium text-white font-playfair">{t("specialOffers")}</h3>
                        <ul className="space-y-3">
                          {specialOffers.slice(0, 2).map((offer, idx) => (
                            <li key={idx} className="flex items-start space-x-3">
                              <div className="flex items-center justify-center w-8 h-8 mt-0.5 rounded-full bg-white/10 text-white">
                                {offer.icon}
                              </div>
                              <div>
                                <Link
                                  href={offer.link}
                                  className="block text-sm font-medium text-white hover:text-white/80"
                                >
                                  {offer.title}
                                </Link>
                                <p className="text-xs text-gray-300">{offer.description}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Footer with quick links */}
                  <div className="flex items-center justify-between px-8 py-4 bg-[#0c2440] border-t border-gray-700/30">
                    <div className="flex items-center space-x-4">
                      <Link
                        href="/book-now"
                        className="flex items-center text-xs font-medium text-white hover:text-white/80"
                      >
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {t("bookNow")}
                      </Link>
                      <Link
                        href="/special-offers"
                        className="flex items-center text-xs font-medium text-white hover:text-white/80"
                      >
                        <Star className="w-3.5 h-3.5 mr-1" />
                        {t("allOffers")}
                      </Link>
                    </div>
                    <div>
                      <Link href={`/${section.id}`} className="text-xs font-medium text-gray-300 hover:text-white">
                        {t("viewAll")} {section.label}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

// Additional icon component
function Sun(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

