"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

export function DiningSection() {
  const { t } = useLanguage()

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <Image
                src="https://le-cdn.website-editor.net/s/4126dc9806774f8188f699b389e985fb/dms3rep/multi/opt/Weintafel-5-1920w.jpg?Expires=1743677346&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9sZS1jZG4ud2Vic2l0ZS1lZGl0b3IubmV0L3MvNDEyNmRjOTgwNjc3NGY4MTg4ZjY5OWIzODllOTg1ZmIvZG1zM3JlcC9tdWx0aS9vcHQvV2VpbnRhZmVsLTUtMTkyMHcuanBnIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzQzNjc3MzQ2fX19XX0_&Signature=sxC8r0dpVeZ0eGMlhYG-6hP-yzPD3b5v~2hKTvrVHinK9FVrzNX-KCbes580Ij9iM3AN-nX~B0MGes3~smkPXI2SRQYohl1tVJHBcth7zJG3YIan-z0EXv~0ILiwCiQOXo~J60hr-awsMa1ogEkgDiGh5H5Mp3oqjcsmWzLhAJWFmL-K2Rq76PELllIbxfzrgE8Bk~JxRlj2xl2nDfkyUm4XQjySTN6Yt1MTpeDqwXdGq9EZitwpFn6A-93laKAXaXT-xfCXLeoZGK-FPBpxmXRG4t7jBRx9DYQFH9meEg8a~6K5wQsRWVofL6s2P6vkMS2HgeMLARmrtNmFi4W7sA__&Key-Pair-Id=K2NXBXLF010TJW"
                alt="Fine dining restaurant"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair mb-4 sm:mb-6">{t("diningTitle")}</h2>
            <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">{t("diningDescription")}</p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-playfair">Hofküche</h3>
              <h3 className="text-xl sm:text-2xl font-playfair">Weinkeller</h3>
            </div>

            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white" asChild>
              <Link href="/dining">{t("showAll")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

