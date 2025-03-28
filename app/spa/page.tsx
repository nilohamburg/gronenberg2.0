"use client"

import { Navbar } from "@/components/navbar"
import { PageHeader } from "@/components/page-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"

export default function SpaPage() {
  const { t } = useLanguage()

  const treatments = [
    {
      name: t("signatureMassage"),
      duration: "60 / 90 min",
      description:
        "Our signature full-body massage combines techniques from around the world to release tension and promote deep relaxation.",
      price: "€120 / €160",
    },
    {
      name: t("alpineHerbalWrap"),
      duration: "75 min",
      description: "A detoxifying body treatment using local herbs and minerals to purify and rejuvenate the skin.",
      price: "€140",
    },
    {
      name: t("facialRenewal"),
      duration: "60 min",
      description: "A customized facial treatment to address your specific skin concerns and restore natural radiance.",
      price: "€110",
    },
    {
      name: t("couplesRetreat"),
      duration: "120 min",
      description:
        "Share a relaxing experience with side-by-side massages, followed by private time in our spa suite with champagne.",
      price: `€320 ${t("perCouple")}`,
    },
  ]

  const facilities = [
    {
      name: t("indoorHeatedPool"),
      description:
        "Our 20-meter indoor pool is maintained at the perfect temperature year-round, with panoramic views of the surrounding landscape.",
      image: "/placeholder.svg?height=400&width=600&text=Indoor Pool",
    },
    {
      name: t("saunaLandscape"),
      description:
        "Experience our collection of Finnish sauna, bio sauna, and steam bath to cleanse and rejuvenate your body.",
      image: "/placeholder.svg?height=400&width=600&text=Sauna",
    },
    {
      name: t("relaxationAreas"),
      description:
        "Multiple quiet spaces designed for post-treatment relaxation, featuring comfortable loungers and herbal teas.",
      image: "/placeholder.svg?height=400&width=600&text=Relaxation Area",
    },
    {
      name: t("fitnessCenter"),
      description:
        "State-of-the-art equipment for cardio and strength training, with personal trainers available upon request.",
      image: "/placeholder.svg?height=400&width=600&text=Fitness Center",
    },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />
      <PageHeader title={t("spaTitle")} description={t("spaDescription")} image="/images/spa-bg.jpg" />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-playfair mb-4">{t("havenOfRelaxation")}</h2>
          <p className="text-lg text-gray-700">{t("spaDescription")}</p>
        </div>

        {/* Spa Facilities */}
        <div className="mb-20">
          <h2 className="text-3xl font-playfair text-center mb-12">{t("spaFacilities")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {facilities.map((facility, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="relative h-64">
                  <Image src={facility.image || "/placeholder.svg"} alt={facility.name} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-playfair mb-2">{facility.name}</h3>
                  <p className="text-gray-600">{facility.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spa Treatments */}
        <div className="mb-16">
          <h2 className="text-3xl font-playfair text-center mb-12">{t("spaTreatments")}</h2>
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {treatments.map((treatment, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 mb-6 last:border-0 last:mb-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-playfair">{treatment.name}</h3>
                    <p className="text-primary font-medium">{treatment.price}</p>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{treatment.duration}</p>
                  <p className="text-gray-700">{treatment.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-10">
            <Button size="lg">{t("bookTreatment")}</Button>
          </div>
        </div>

        {/* Spa Packages */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-3xl font-playfair text-center mb-6">{t("spaPackages")}</h2>
          <p className="text-center text-gray-700 mb-8">
            Indulge in our carefully curated spa packages designed to provide a complete wellness experience. Each
            package includes a selection of our most popular treatments and access to all spa facilities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <h3 className="text-xl font-playfair mb-2">{t("relaxationJourney")}</h3>
              <p className="text-sm text-gray-500 mb-4">3 {t("hours")}</p>
              <ul className="text-gray-700 mb-6 space-y-2">
                <li>Welcome Ritual</li>
                <li>60-min Massage</li>
                <li>Express Facial</li>
                <li>Spa Refreshments</li>
              </ul>
              <p className="text-lg font-medium mb-4">€220 {t("perPerson")}</p>
              <Button variant="outline" className="w-full">
                {t("bookNowButton")}
              </Button>
            </div>
            <div className="border border-primary rounded-lg p-6 text-center bg-primary/5 relative">
              <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs rounded-bl-lg rounded-tr-lg">
                {t("mostPopular")}
              </div>
              <h3 className="text-xl font-playfair mb-2">{t("completeWellness")}</h3>
              <p className="text-sm text-gray-500 mb-4">5 {t("hours")}</p>
              <ul className="text-gray-700 mb-6 space-y-2">
                <li>Welcome Ritual</li>
                <li>90-min Massage</li>
                <li>Full Facial</li>
                <li>Body Scrub</li>
                <li>Spa Lunch</li>
              </ul>
              <p className="text-lg font-medium mb-4">€340 {t("perPerson")}</p>
              <Button className="w-full">{t("bookNowButton")}</Button>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <h3 className="text-xl font-playfair mb-2">{t("couplesEscape")}</h3>
              <p className="text-sm text-gray-500 mb-4">4 {t("hours")}</p>
              <ul className="text-gray-700 mb-6 space-y-2">
                <li>Private Spa Suite</li>
                <li>Couples Massage</li>
                <li>Facial for Two</li>
                <li>Champagne & Chocolates</li>
              </ul>
              <p className="text-lg font-medium mb-4">€480 {t("perCouple")}</p>
              <Button variant="outline" className="w-full">
                {t("bookNowButton")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

