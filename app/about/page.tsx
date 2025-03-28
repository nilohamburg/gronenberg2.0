"use client"

import { Navbar } from "@/components/navbar"
import { PageHeader } from "@/components/page-header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"

export default function AboutPage() {
  const { t } = useLanguage()

  const timeline = [
    {
      year: "1892",
      title: t("foundation"),
      description:
        "The original mill was built by the Gronenberg family, serving as a working water mill for the local community.",
    },
    {
      year: "1925",
      title: t("transformation"),
      description:
        "The mill was converted into a small inn, offering accommodation to travelers passing through the region.",
    },
    {
      year: "1968",
      title: t("expansion"),
      description: "The property underwent its first major expansion, adding additional rooms and a restaurant.",
    },
    {
      year: "2005",
      title: t("renovation"),
      description:
        "A complete renovation transformed the property into a luxury hotel while preserving its historic character.",
    },
    {
      year: "2020",
      title: t("modernEra"),
      description:
        "The latest renovation added modern amenities and sustainability features, bringing the historic property into the 21st century.",
    },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />
      <PageHeader
        title={t("aboutTitle")}
        description={t("aboutDescription")}
        image="/placeholder.svg?height=600&width=1920&text=About Gronenberger Mühle"
      />

      <div className="container mx-auto px-4 py-16">
        {/* Our Story */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-playfair text-center mb-8">{t("ourStory")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-700 mb-4">
                Set in an iconic 19th-century building, Gronenberger Mühle has a rich history that dates back to 1892.
                Originally built as a water mill, the property has evolved over the decades while maintaining its
                historic charm and character.
              </p>
              <p className="text-gray-700">
                Today, this luxury 5-star hotel offers timeless European luxury with unrivalled access to nature trails.
                The urban charm in the peaceful surroundings of the countryside makes the resort a true hideaway for
                discerning travelers seeking both comfort and authenticity.
              </p>
            </div>
            <div>
              <Image
                src="/placeholder.svg?height=400&width=600&text=Historic Gronenberger Mühle"
                alt="Historic Gronenberger Mühle"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-playfair text-center mb-12">{t("ourHistory")}</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200"></div>

            {/* Timeline events */}
            <div className="space-y-12">
              {timeline.map((event, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div className="w-5/12"></div>

                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-white"></div>

                  {/* Content */}
                  <div className="w-5/12 bg-white p-6 rounded-lg shadow-md">
                    <div className="text-primary font-bold mb-2">{event.year}</div>
                    <h3 className="text-xl font-playfair mb-2">{event.title}</h3>
                    <p className="text-gray-600">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-playfair text-center mb-12">{t("ourValues")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary">♥</span>
              </div>
              <h3 className="text-xl font-playfair mb-3">{t("hospitality")}</h3>
              <p className="text-gray-600">
                We believe in creating a warm, welcoming environment where every guest feels like family.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary">✓</span>
              </div>
              <h3 className="text-xl font-playfair mb-3">{t("excellence")}</h3>
              <p className="text-gray-600">
                We strive for perfection in every detail, from the quality of our accommodations to the service we
                provide.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary">♲</span>
              </div>
              <h3 className="text-xl font-playfair mb-3">{t("sustainability")}</h3>
              <p className="text-gray-600">
                We are committed to preserving our natural environment and operating in an environmentally responsible
                manner.
              </p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-playfair text-center mb-12">{t("ourTeam")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((person) => (
              <div key={person} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=200&width=200&text=Team Member ${person}`}
                    alt={`Team Member ${person}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-playfair mb-1">Name Surname</h3>
                <p className="text-primary mb-2">Position</p>
                <p className="text-gray-600 text-sm">
                  Brief description about the team member and their expertise in the hospitality industry.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

