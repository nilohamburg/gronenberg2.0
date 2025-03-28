"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useLanguage } from "@/contexts/language-context"
import { Bed, UtensilsCrossed, Waves, Users, Info, Phone } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <NavigationMenu>
      <NavigationMenuList className="space-x-1">
        {/* Rooms & Suites */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white">
            {t("rooms")}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/rooms"
                    style={{
                      backgroundImage: "url('/placeholder.svg?height=300&width=300')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="mt-4 mb-2 text-lg font-medium text-white bg-black/30 p-2 rounded">
                      {t("discoverMore")}
                    </div>
                    <p className="text-sm leading-tight text-white bg-black/30 p-2 rounded">
                      {t("roomsDescription").substring(0, 100)}...
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/rooms?capacity=2" icon={<Bed className="h-4 w-4" />} title="Alle Ferienhäuser">
                Entdecke 32 luxoriöse Ferienhäuser
              </ListItem>
              <ListItem href="/rooms?capacity=4" icon={<Bed className="h-4 w-4" />} title="Urlaub mit Hund">
                Ostsee Urlaub mit deinem Hund
              </ListItem>
              <ListItem href="/rooms?seaView=true" icon={<Bed className="h-4 w-4" />} title="Ferienhaus mit Seeblick">
                Direkt am Wasser entspannen
              </ListItem>
              <ListItem href="/rooms?dogsAllowed=true" icon={<Bed className="h-4 w-4" />} title="Ferienhaus mit Hund">
                Dein Vierbeiner ist herzlich willkommen
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Dining */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white">
            {t("dining")}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
              <ListItem
                href="/dining#muhle-restaurant"
                icon={<UtensilsCrossed className="h-4 w-4" />}
                title="Mühle Restaurant"
              >
                Fine dining with local and international cuisine
              </ListItem>
              <ListItem href="/dining#lounge" icon={<UtensilsCrossed className="h-4 w-4" />} title="The Lounge">
                Casual dining and cocktails
              </ListItem>
              <ListItem
                href="/dining#garden-terrace"
                icon={<UtensilsCrossed className="h-4 w-4" />}
                title="Garden Terrace"
              >
                Al fresco dining with scenic views
              </ListItem>
              <ListItem href="/dining#wine-cellar" icon={<UtensilsCrossed className="h-4 w-4" />} title="Wine Cellar">
                Exclusive wine tastings and pairings
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Wellness */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white">
            {t("spa")}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
              <ListItem href="/spa#treatments" icon={<Waves className="h-4 w-4" />} title="Spa Treatments">
                Rejuvenating massages and therapies
              </ListItem>
              <ListItem href="/spa#facilities" icon={<Waves className="h-4 w-4" />} title="Spa Facilities">
                Pool, saunas, and relaxation areas
              </ListItem>
              <ListItem href="/spa#packages" icon={<Waves className="h-4 w-4" />} title="Wellness Packages">
                Comprehensive spa experiences
              </ListItem>
              <ListItem href="/spa#fitness" icon={<Waves className="h-4 w-4" />} title="Fitness Center">
                State-of-the-art equipment and classes
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Meetings & Events */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white">
            {t("meetings")}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
              <ListItem href="/meetings#venues" icon={<Users className="h-4 w-4" />} title="Event Venues">
                Spaces for every occasion
              </ListItem>
              <ListItem href="/meetings#weddings" icon={<Users className="h-4 w-4" />} title="Weddings">
                Create your perfect celebration
              </ListItem>
              <ListItem href="/meetings#corporate" icon={<Users className="h-4 w-4" />} title="Corporate Events">
                Professional settings for business gatherings
              </ListItem>
              <ListItem href="/meetings#packages" icon={<Users className="h-4 w-4" />} title="Event Packages">
                All-inclusive options for your event
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* About & Contact */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white">
            {t("about")}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
              <ListItem href="/about#story" icon={<Info className="h-4 w-4" />} title="Our Story">
                The history of Gronenberger Mühle
              </ListItem>
              <ListItem href="/about#team" icon={<Info className="h-4 w-4" />} title="Our Team">
                Meet the people behind our service
              </ListItem>
              <ListItem href="/contact" icon={<Phone className="h-4 w-4" />} title="Contact Us">
                Get in touch with our team
              </ListItem>
              <ListItem href="/about#location" icon={<Info className="h-4 w-4" />} title="Location">
                How to find us
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string
  icon?: React.ReactNode
}

const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
  ({ className, title, icon, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="flex items-center gap-2 text-sm font-medium leading-none">
              {icon}
              <span>{title}</span>
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"

