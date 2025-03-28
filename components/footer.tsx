"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-900 text-white py-12 sm:py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          <div>
            <h3 className="text-lg sm:text-xl font-playfair mb-4">{t("aboutUs")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  Awards
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-primary transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-playfair mb-4">{t("services")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/rooms" className="hover:text-primary transition-colors">
                  {t("rooms")}
                </Link>
              </li>
              <li>
                <Link href="/dining" className="hover:text-primary transition-colors">
                  {t("dining")}
                </Link>
              </li>
              <li>
                <Link href="/spa" className="hover:text-primary transition-colors">
                  {t("spaTitle")}
                </Link>
              </li>
              <li>
                <Link href="/meetings" className="hover:text-primary transition-colors">
                  {t("meetings")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-playfair mb-4">{t("contact")}</h3>
            <ul className="space-y-2">
              <li>Gronenberg, Germany</li>
              <li>info@gronenberger-muhle.com</li>
              <li>+49 123 456 7890</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-playfair mb-4">{t("newsletter")}</h3>
            <p className="mb-4">Sign up for offers, news and travel inspiration</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder={t("emailPlaceholder")}
                className="px-4 py-2 w-full bg-gray-800 border border-gray-700 focus:outline-none focus:border-primary rounded-md"
              />
              <button className="bg-primary px-4 py-2 text-white rounded-md whitespace-nowrap">{t("subscribe")}</button>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>
            © {new Date().getFullYear()} Gronenberger Mühle. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  )
}

