"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

export function AboutSection() {
  const { t } = useLanguage()

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair mb-4 sm:mb-6">{t("aboutTitle")}</h2>
            <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">{t("aboutDescription")}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div>
                <p className="flex items-center gap-2">
                  <span className="text-primary">✉</span>
                  info@gronenberger-muhle.com
                </p>
              </div>
              <div>
                <p className="flex items-center gap-2">
                  <span className="text-primary">✆</span>
                  +49 123 456 7890
                </p>
              </div>
              <div>
                <p className="flex items-center gap-2">
                  <span className="text-primary">⌖</span>
                  Gronenberg, Germany
                </p>
              </div>
            </div>

            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white" asChild>
              <Link href="/about">{t("hotelDetails")}</Link>
            </Button>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <Image
                src="https://le-cdn.website-editor.net/s/4126dc9806774f8188f699b389e985fb/dms3rep/multi/opt/2023-09-Groneberger-Sa-0058-1355d056-1920w.jpg?Expires=1743677346&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9sZS1jZG4ud2Vic2l0ZS1lZGl0b3IubmV0L3MvNDEyNmRjOTgwNjc3NGY4MTg4ZjY5OWIzODllOTg1ZmIvZG1zM3JlcC9tdWx0aS9vcHQvMjAyMy0wOS1Hcm9uZWJlcmdlci1TYS0wMDU4LTEzNTVkMDU2LTE5MjB3LmpwZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc0MzY3NzM0Nn19fV19&Signature=AnWVwuYo1MKMauU4vfWxS5MO-j-U7wxvVBK3YkMTy~X~jg3~QxdGlHnH4ZtG~qnBmXV2i8U6QhxrFCV2tKAzh7B6XvqbgivSIlITaMzAYY9r1mJsDfUEJ4kmEfR8fpznoBsFbJ~LY2kk2vurS3cB7cRWZa3U06zcYtib4INgU3Togfz0XPl2J9b0HDvPKM56j92JzEHA2l2YaiS9jQHmWc0ecFNx53~Frrqi22Wfq6wGtkz3Syss2Riwi73mWhHhIhzX8mbgAqwfJFnmVOXXAXBKkOHK7TVuQ84xY2ImRWbOPBtTnLetX0hPsGIMf~ZfRtTnt0hG9NXc3LFNKHJUxA__&Key-Pair-Id=K2NXBXLF010TJW"
                alt="Hotel exterior"
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

