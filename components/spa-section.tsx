"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

export function SpaSection() {
  const { t } = useLanguage()

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair mb-4 sm:mb-6">{t("spaTitle")}</h2>
            <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">{t("spaDescription")}</p>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white" asChild>
              <Link href="/spa">{t("readMore")}</Link>
            </Button>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <Image
                src="https://le-cdn.website-editor.net/s/4126dc9806774f8188f699b389e985fb/dms3rep/multi/opt/2023-09-Groneberger-Fr-4509-1920w.jpg?Expires=1743677346&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9sZS1jZG4ud2Vic2l0ZS1lZGl0b3IubmV0L3MvNDEyNmRjOTgwNjc3NGY4MTg4ZjY5OWIzODllOTg1ZmIvZG1zM3JlcC9tdWx0aS9vcHQvMjAyMy0wOS1Hcm9uZWJlcmdlci1Gci00NTA5LTE5MjB3LmpwZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc0MzY3NzM0Nn19fV19&Signature=k56U56fLmzejaViRUouQZNuKqste7o7bbHBd~bGnlpBZ72ZVDvW3vHvd4-N8x8vYvVAO~Ja0rXIJKshHKaJ2oeACGKXglI1fcGV-lcGV-fql2goe8VSEdig7e5MhDp-ubYbITRgM6xBH6GKeqOJzgB9O9KyRvjrqGmgCtMPqx5X6nVZgAj-qcnYQ0PQmwmA7OpmDzR~XYgWot-FUhDCEBqnIZoJyltGXxSyAtKLNFLtutgDl8vUhusPeu4BBOrLkSADHoFGu6sW~TIBIMr5AfG4a1gu25B25dwJ5GwnImXEJ51eLSeuyya3zeVedu8QmiP9jPVPGLgt~lGtLOZBXOw__&Key-Pair-Id=K2NXBXLF010TJW"
                alt="Luxury spa pool"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

