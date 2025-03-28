"use client"

import { Navbar } from "@/components/navbar"
import { PageHeader } from "@/components/page-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function ContactPage() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen">
      <Navbar />
      <PageHeader
        title={t("contactTitle")}
        description={t("contactDescription")}
        image="/placeholder.svg?height=600&width=1920&text=Contact Us"
      />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-playfair mb-6">{t("getInTouch")}</h2>
              <p className="text-gray-700 mb-8">
                We're here to answer any questions you may have about our accommodations, services, or special requests.
                Feel free to contact us using the information below or by filling out the contact form.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-primary mr-4 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium mb-1">{t("address")}</h3>
                    <p className="text-gray-600">
                      Gronenberger Straße 123
                      <br />
                      12345 Gronenberg
                      <br />
                      Germany
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-primary mr-4 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium mb-1">{t("phone")}</h3>
                    <p className="text-gray-600">+49 123 456 7890</p>
                    <p className="text-gray-500 text-sm">Monday to Sunday, 24/7</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-primary mr-4 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium mb-1">{t("email")}</h3>
                    <p className="text-gray-600">info@gronenberger-muhle.com</p>
                    <p className="text-gray-500 text-sm">We'll respond as soon as possible</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-primary mr-4 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium mb-1">{t("receptionHours")}</h3>
                    <p className="text-gray-600">24/7</p>
                    <p className="text-gray-500 text-sm">Our front desk is always available</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3">{t("directions")}</h3>
                <p className="text-gray-600 mb-4">
                  Gronenberger Mühle is located 2 hours from the nearest international airport. We offer shuttle
                  services for our guests, which can be arranged prior to arrival.
                </p>
                <Button variant="outline">{t("viewOnMap")}</Button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-playfair mb-6">{t("sendMessage")}</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="first-name" className="text-sm font-medium">
                      {t("firstName")}
                    </label>
                    <Input id="first-name" placeholder={t("firstName")} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last-name" className="text-sm font-medium">
                      {t("lastName")}
                    </label>
                    <Input id="last-name" placeholder={t("lastName")} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    {t("email")}
                  </label>
                  <Input id="email" type="email" placeholder={t("email")} />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    {t("phoneOptional")}
                  </label>
                  <Input id="phone" placeholder={t("phone")} />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    {t("subject")}
                  </label>
                  <Select>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder={t("subject")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reservation">{t("reservationInquiry")}</SelectItem>
                      <SelectItem value="information">{t("generalInformation")}</SelectItem>
                      <SelectItem value="feedback">{t("feedback")}</SelectItem>
                      <SelectItem value="special">{t("specialRequest")}</SelectItem>
                      <SelectItem value="other">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    {t("message")}
                  </label>
                  <Textarea id="message" placeholder={t("message")} rows={5} />
                </div>

                <Button type="submit" className="w-full">
                  {t("sendMessageButton")}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

