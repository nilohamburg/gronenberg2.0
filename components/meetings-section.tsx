"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

export function MeetingsSection() {
  const { t } = useLanguage()

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <Image
                src="https://le-cdn.website-editor.net/s/4126dc9806774f8188f699b389e985fb/dms3rep/multi/opt/Gesellige-Tafel-1920w.jpg?Expires=1743677346&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9sZS1jZG4ud2Vic2l0ZS1lZGl0b3IubmV0L3MvNDEyNmRjOTgwNjc3NGY4MTg4ZjY5OWIzODllOTg1ZmIvZG1zM3JlcC9tdWx0aS9vcHQvR2VzZWxsaWdlLVRhZmVsLTE5MjB3LmpwZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc0MzY3NzM0Nn19fV19&Signature=mojUzBNnWrjOOj4ST45Ev1DI2bCXX3XXUs2gA1GynKZnMc-lvgwfZe-EurvLyWO6afhhifEnc1ICV6yr6rZF1lQA0GSBaVHFi0tnL1V9bHdRkuzHM~tpmV7R0ZUtOqGhOuWEaMaA8rp7tqtlpTpKqROKrCj5h-4c4TTtqhrZSIrmja-NZ67kHqYGBViGItFjmeuUaN0fq~fqIbjpxI5cWvwKK42Tu4bhLphMZ05R6D-UiL5fOqLRrnt1zjRz~~M-Yw9TkdDiF3h3xUu85OnGI2ohAY9FahcD4s7b~A-xWmOWHd6BJcnVNq58dLggkn2ue2UiQ4sewF3wVw0Ey7iYUg__&Key-Pair-Id=K2NXBXLF010TJW"
                alt="Meeting venue"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair mb-4 sm:mb-6">{t("meetingsTitle")}</h2>
            <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">{t("meetingsDescription")}</p>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white" asChild>
              <Link href="/meetings">{t("discoverMore")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

