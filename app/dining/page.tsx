"use client"

import { Navbar } from "@/components/navbar"
import { PageHeader } from "@/components/page-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export default function DiningPage() {
  const { t } = useLanguage()

  const restaurants = [
    {
      id: 1,
      name: t("muhleRestaurant"),
      description: t("diningDescription"),
      hours: `${t("breakfast")}: 7:00 - 10:30 | ${t("dinner")}: 18:00 - 22:00`,
      image: "/placeholder.svg?height=600&width=800&text=Mühle Restaurant",
      slug: "muhle-restaurant",
    },
    {
      id: 2,
      name: t("theLounge"),
      description:
        "Ein stilvoller Raum zum Genießen leichter Mahlzeiten, Nachmittagstee und Cocktails. Die Lounge bietet eine entspannte Atmosphäre mit bequemen Sitzgelegenheiten und Panoramablick auf die umliegende Landschaft.",
      hours: `${t("daily")}: 10:00 - 00:00`,
      image: "/placeholder.svg?height=600&width=800&text=The Lounge",
      slug: "",
    },
    {
      id: 3,
      name: t("gardenTerrace"),
      description:
        "Speisen Sie im Freien auf unserer schönen Terrasse, umgeben von üppigen Gärten. Genießen Sie ein lässiges Mittag- oder Abendessen, während Sie die frische Luft und die malerische Aussicht genießen. Wetterabhängig.",
      hours: `${t("lunch")}: 12:00 - 15:00 | ${t("dinner")}: 18:00 - 21:30 (${t("summerSeason")})`,
      image: "/placeholder.svg?height=600&width=800&text=Garden Terrace",
      slug: "",
    },
    {
      id: 4,
      name: t("wineCellar"),
      description:
        "Unser historischer Weinkeller beherbergt eine umfangreiche Sammlung feiner Weine aus aller Welt. Nehmen Sie an Weinverkostungen und speziellen Pairing-Dinners teil, die von unserem Sommelier veranstaltet werden.",
      hours: `${t("wineTastings")}: ${t("byReservationOnly")}`,
      image:
        "https://le-cdn.website-editor.net/s/4126dc9806774f8188f699b389e985fb/dms3rep/multi/opt/Weintafel-5-2880w.jpg?Expires=1745574296&Signature=ZO9DLtesJpC-33I3Ty7qbA7XLO4kkscE9lbI64w4NI1b-MgH5qz2zUX4IWsv4LcUwyb~JozZahmVar8duclivkiKaiFWHeo0eo9J90CSPEUqxhwfe7NKMzTSqhSOKjcVSZw~O69d2z5HB0oymIWFflBKRBEHq7qbCIGHl2seSpfzKR5j1iiaSMGzRjzLfj8e6M3SIuPCwTpsbFg6otWjKKv~wegQAcBuAyUER9XWR88Wae4kd5kSUtP6lLv7jnpVzcY8JDPmibRco5woZzaHi7OuMJolyArpGhFpyAhCL5FrEMKfHUiZ5pYKPMYURwSCl12SIo~ll9gNANd2dYaz0g__&Key-Pair-Id=K2NXBXLF010TJW",
      slug: "",
    },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />
      <PageHeader title={t("diningTitle")} description={t("diningDescription")} image="/images/restaurant-bg.jpg" />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-playfair mb-4">{t("culinaryExcellence")}</h2>
          <p className="text-lg text-gray-700">{t("diningDescription")}</p>
        </div>

        <div className="space-y-24">
          {restaurants.map((restaurant, index) => (
            <div
              key={restaurant.id}
              className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 items-center`}
            >
              <div className="w-full lg:w-1/2">
                <div className="relative h-80 w-full">
                  <Image
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <h3 className="text-3xl font-playfair mb-4">{restaurant.name}</h3>
                <p className="text-gray-700 mb-4">{restaurant.description}</p>
                <p className="text-sm text-gray-500 mb-6">{restaurant.hours}</p>
                <div className="flex gap-4">
                  {restaurant.slug ? (
                    <Button asChild>
                      <Link href={`/dining/${restaurant.slug}`}>{t("viewDetails")}</Link>
                    </Button>
                  ) : (
                    <Button>{t("viewMenu")}</Button>
                  )}
                  <Button variant="outline">{t("reserveTable")}</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  )
}

