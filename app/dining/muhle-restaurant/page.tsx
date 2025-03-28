"use client"

import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHeader } from "@/components/page-header"
import { ReservationForm, MenuHighlights, RestaurantGallery } from "@/components/restaurant-page-client"
import { FullMenuDisplay } from "@/components/full-menu-display"
import { RestaurantOpeningHours } from "@/components/restaurant-opening-hours"
import { RestaurantEventCalendar } from "@/components/restaurant-event-calendar"

export default function MuhleRestaurantPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Page Header */}
        <PageHeader
          title="Mühle Restaurant"
          description="Tradition meets culinary excellence in our historic watermill"
          image="https://le-cdn.website-editor.net/s/4126dc9806774f8188f699b389e985fb/dms3rep/multi/opt/2023-09-Groneberger-Sa-0562-2880w.jpg?Expires=1745574296&Signature=Pp07quBnwQSl-n3AN9~tUgHLSCpCHA0CqcJAbgfkNaP4HJ8rlKHEZT6tLKiC6wPvIAE0VMhgk-RXKOEDfc-Ob0833Us5RUy8o2vrd3A9lKU9oHGOfjJHLQhu75~tGfF5Gfi4n0JkD328Y~nCMH6XULPuZQ2DYObN5YT7NRhadhJDs1JvcFQnpuuZn~P5H7NpkX9ev9Gu8tEZKIgy8Sp13j0Y~ceFRqdgq-spxRVtYjsJ14ai8wEdSh5RIdsOyoQ60PSPMUhbgrzcPv5t2H9BcHV9iDtFVd5Pyrs65lkjFhov5rUYWHXhqOL4NtK3R4YsS3qg1RQlDXz-y7WqwexZKA__&Key-Pair-Id=K2NXBXLF010TJW"
        />

        {/* Restaurant Overview */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Restaurant</h2>
              <p className="text-gray-700 mb-6">
                In our historic watermill, tradition and enjoyment come together: surrounded by old walls and rustic
                wooden beams, you can watch our chef Konstantin directly preparing our seasonal delicacies.
              </p>
              <div className="mb-6">
                <RestaurantOpeningHours />
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/dining/muhle-restaurant/reservations"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md transition-colors"
                >
                  Reserve a Table
                </a>
                <a
                  href="#menu"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="border border-primary text-primary hover:bg-primary/10 px-6 py-2 rounded-md transition-colors"
                >
                  View Menu
                </a>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://le-cdn.website-editor.net/s/4126dc9806774f8188f699b389e985fb/dms3rep/multi/opt/2023-09-Groneberger-Sa-0622-2880w.jpg?Expires=1745574296&Signature=BrF5vHfkOUvHNK~HcUF4WqgXv0eB6UTAMWijXmqBWLozMiYDUKjvgt-qkkUHdFREXl3xGwLwyS0ki8KP9SuY-Gkr8UWccqnRw~SlfLPpGdjm9-cfzxHsPk35O-lJZ3STwysTq8eXCr6X~eTWFRNKimJu5ht3D6~hTkMzQbdQyS6hqroOmugsN8XPt9RW3U1v9KBDdFb6NguupnT8UEZVCwsgajS9C5vdbyOd0UvokwLD~a5PG2LOYZujPpZBbX-3oeNh1~tvWs3sklSufTc23irgl0gAi3McXEONvXB68JH9yNI3Gve7tt5R5lKlXysGeiervcReYslMCG~QAeqlkQ__&Key-Pair-Id=K2NXBXLF010TJW"
                alt="Mühle Restaurant Interior"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Menu Highlights */}
        <section className="bg-secondary/20 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Menu Highlights</h2>
            <MenuHighlights />
          </div>
        </section>

        {/* Full Menu Section */}
        <section id="menu" className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <FullMenuDisplay />
          </div>
        </section>

        {/* Event Calendar Section */}
        <section id="events" className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <RestaurantEventCalendar />
          </div>
        </section>

        {/* Chef Section */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-4">Meet Our Chef</h2>
              <h3 className="text-xl text-primary font-medium mb-4">Konstantin Meyer</h3>
              <p className="text-gray-700 mb-6">
                With over 20 years of culinary experience, Chef Konstantin brings his passion for local ingredients and
                traditional German cuisine with a modern twist to the Mühle Restaurant. His philosophy centers around
                sustainability, seasonality, and showcasing the rich flavors of Schleswig-Holstein.
              </p>
              <p className="text-gray-700">
                "My cooking is inspired by the landscape around us - the Baltic Sea, the lakes, and the fertile
                farmland. Every dish tells a story of our region and its culinary heritage."
              </p>
            </div>
            <div className="order-1 md:order-2 rounded-full overflow-hidden w-48 h-48 mx-auto md:w-80 md:h-80">
              <Image
                src="/placeholder.svg?height=400&width=400&text=Chef+Portrait"
                alt="Chef Konstantin Meyer"
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Reservation Section */}
        <section className="bg-primary text-primary-foreground py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Make a Reservation</h2>
            <p className="max-w-2xl mx-auto mb-8">
              Reserve your table at Mühle Restaurant and experience the perfect blend of historic ambiance and
              exceptional cuisine.
            </p>
            <ReservationForm />
          </div>
        </section>

        {/* Gallery */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Restaurant Gallery</h2>
          <RestaurantGallery />
        </section>
      </main>
      <Footer />
    </>
  )
}

