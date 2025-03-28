"use client"

import { BookingForm } from "@/components/booking-form"
import { useLanguage } from "@/contexts/language-context"

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://le-cdn.website-editor.net/s/4126dc9806774f8188f699b389e985fb/dms3rep/multi/opt/2023-09-Groneberger-Sa-0058-1355d056-1920w.jpg?Expires=1743677346&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9sZS1jZG4ud2Vic2l0ZS1lZGl0b3IubmV0L3MvNDEyNmRjOTgwNjc3NGY4MTg4ZjY5OWIzODllOTg1ZmIvZG1zM3JlcC9tdWx0aS9vcHQvMjAyMy0wOS1Hcm9uZWJlcmdlci1TYS0wMDU4LTEzNTVkMDU2LTE5MjB3LmpwZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc0MzY3NzM0Nn19fV19&Signature=AnWVwuYo1MKMauU4vfWxS5MO-j-U7wxvVBK3YkMTy~X~jg3~QxdGlHnH4ZtG~qnBmXV2i8U6QhxrFCV2tKAzh7B6XvqbgivSIlITaMzAYY9r1mJsDfUEJ4kmEfR8fpznoBsFbJ~LY2kk2vurS3cB7cRWZa3U06zcYtib4INgU3Togfz0XPl2J9b0HDvPKM56j92JzEHA2l2YaiS9jQHmWc0ecFNx53~Frrqi22Wfq6wGtkz3Syss2Riwi73mWhHhIhzX8mbgAqwfJFnmVOXXAXBKkOHK7TVuQ84xY2ImRWbOPBtTnLetX0hPsGIMf~ZfRtTnt0hG9NXc3LFNKHJUxA__&Key-Pair-Id=K2NXBXLF010TJW)",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto pt-20 md:pt-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-playfair mb-4 md:mb-6">
          {t("heroTitle")}
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-8 md:mb-12 max-w-3xl mx-auto">{t("heroSubtitle")}</p>

        <BookingForm />
      </div>
    </section>
  )
}

