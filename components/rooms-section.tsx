"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

export function RoomsSection() {
  const { t } = useLanguage()

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair mb-4 sm:mb-6">{t("roomsTitle")}</h2>
            <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">{t("roomsDescription")}</p>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white" asChild>
              <Link href="/rooms">{t("discoverMore")}</Link>
            </Button>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <Image
                src="https://le-cdn.website-editor.net/s/4126dc9806774f8188f699b389e985fb/dms3rep/multi/opt/Gronenberger-Muehle-Terrassenhaueser-2018-web-1920w.jpg?Expires=1743677346&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9sZS1jZG4ud2Vic2l0ZS1lZGl0b3IubmV0L3MvNDEyNmRjOTgwNjc3NGY4MTg4ZjY5OWIzODllOTg1ZmIvZG1zM3JlcC9tdWx0aS9vcHQvR3JvbmVuYmVyZ2VyLU11ZWhsZS1UZXJyYXNzZW5oYXVlc2VyLTIwMTgtd2ViLTE5MjB3LmpwZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc0MzY3NzM0Nn19fV19&Signature=MPjGge-BL1EcaxHuydBfMUmytBl7WHK2Dk~UlF~WIttVoHqCg0JGShpO3DmWqsiuPjgMeSFlb6G0siCs15hzO-sfOj-gyDfRq91oTB6hfuU25mQalLTdjfLWmLyy4OG3N0R6ViLOJVd9YYdCJXUcz70Xx1rBw0Sxl00M8vEXDo~oZ1jgVAGmvjCAawOlCn9Q-ILdmq7vGHJm1mGAQSXJKt4QQc41Z0C7sJzI8B3QQXbCM~PcIdcAIDr-nJ47UZbQkDEx7LYKY6LWFTiGW2IxkNt3Wn-NmSoudAODWWiQNPBSmLRWpgf9LTxlqpG5R7Ii-fQSwjkRvX8DN9Oi60zpvA__&Key-Pair-Id=K2NXBXLF010TJW"
                alt="Ferienhäuser an der Ostsee Scharbeutz"
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

