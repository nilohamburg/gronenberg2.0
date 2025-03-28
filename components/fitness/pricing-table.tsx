"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PricingPeriod = "24" | "12" | "1"

export function PricingTable() {
  const [activePeriod, setActivePeriod] = useState<PricingPeriod>("24")

  const handlePeriodChange = (period: PricingPeriod) => {
    setActivePeriod(period)
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8">Wähle deinen Tarif</h2>

      {/* Period Selector */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex rounded-md overflow-hidden">
          <Button
            variant={activePeriod === "24" ? "default" : "outline"}
            className={cn(
              "rounded-none px-8 py-6 text-lg font-medium",
              activePeriod === "24" ? "bg-primary text-white" : "bg-gray-200 text-gray-700",
            )}
            onClick={() => handlePeriodChange("24")}
          >
            24 Monate
          </Button>
          <Button
            variant={activePeriod === "12" ? "default" : "outline"}
            className={cn(
              "rounded-none px-8 py-6 text-lg font-medium",
              activePeriod === "12" ? "bg-primary text-white" : "bg-gray-200 text-gray-700",
            )}
            onClick={() => handlePeriodChange("12")}
          >
            12 Monate
          </Button>
          <Button
            variant={activePeriod === "1" ? "default" : "outline"}
            className={cn(
              "rounded-none px-8 py-6 text-lg font-medium",
              activePeriod === "1" ? "bg-primary text-white" : "bg-gray-200 text-gray-700",
            )}
            onClick={() => handlePeriodChange("1")}
          >
            1 Monat
          </Button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Bestseller */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-center mb-4">Bestseller</h3>
            <p className="text-center text-sm mb-6">
              Werde Teil der Community von Fitness First BLACK und erlebe Fitness & Lifestyle auf absolutem
              Premium-Niveau!
            </p>

            <div className="border-t border-b py-6 my-6">
              <h4 className="text-lg font-semibold mb-4">Leistungen</h4>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>Pausen-Option</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>EGYM</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>Getränke-Flat</span>
                </li>
                <li className="flex items-center">
                  <div className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 mr-2" disabled />
                    <span>Handtuch-Flat (5,00 € wöchentlich)</span>
                  </div>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>Kurse</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>PERFORMANCE</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>PHYSIO</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>Wellness-Bereich</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <p className="text-4xl font-bold text-primary">0 €</p>
              <p className="text-sm text-gray-600 mt-2">
                wöchentlich in den ersten 8 Wochen deiner Mitgliedschaft, danach 17,90 € wöchentlich*.
              </p>
            </div>
          </div>

          <div className="px-8 pb-8">
            <Button className="w-full bg-primary text-white py-6" size="lg">
              AUSWÄHLEN
            </Button>
          </div>
        </div>

        {/* Studenten */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-center mb-4">Studenten, Schüler & Azubis</h3>
            <p className="text-center text-sm mb-6">
              Profitiere bei Fitness First BLACK von 8,50€ Rabatt pro Monat sowie flexiblen Zahlpausen während
              Auslandssemestern!
            </p>

            <div className="border-t border-b py-6 my-6">
              <h4 className="text-lg font-semibold mb-4">Leistungen</h4>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>Pausen-Option</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>EGYM</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>Getränke-Flat</span>
                </li>
                <li className="flex items-center">
                  <div className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 mr-2" disabled />
                    <span>Handtuch-Flat (5,00 € wöchentlich)</span>
                  </div>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>Kurse</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>PERFORMANCE</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>PHYSIO</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>Wellness-Bereich</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <p className="text-4xl font-bold text-primary">0 €</p>
              <p className="text-sm text-gray-600 mt-2">
                wöchentlich in den ersten 8 Wochen deiner Mitgliedschaft, danach 15,90 € wöchentlich*.
              </p>
            </div>
          </div>

          <div className="px-8 pb-8">
            <Button className="w-full bg-primary text-white py-6" size="lg">
              AUSWÄHLEN
            </Button>
          </div>
        </div>

        {/* Wechselangebot */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-center mb-4">Wechselangebot</h3>
            <p className="text-center text-sm mb-6">
              Werde jetzt Mitglied bei Fitness First und du trainierst je nach Restlaufzeit deiner aktuellen
              Mitgliedschaft bei einem anderen Fitnessstudiobetreiber bis zu 12 Monate gratis!
            </p>

            <div className="border-t border-b py-6 my-6">
              <h4 className="text-lg font-semibold mb-4">Leistungen</h4>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>Pausen-Option</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>EGYM</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>Getränke-Flat</span>
                </li>
                <li className="flex items-center">
                  <div className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 mr-2" disabled />
                    <span>Handtuch-Flat (5,00 € wöchentlich)</span>
                  </div>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>Kurse</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>PERFORMANCE</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>PHYSIO</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>Wellness-Bereich</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <p className="text-4xl font-bold text-primary">0 €</p>
              <p className="text-sm text-gray-600 mt-2">
                wöchentlich in den ersten 8 Wochen deiner Mitgliedschaft, danach 17,90 € wöchentlich*.
              </p>
            </div>
          </div>

          <div className="px-8 pb-8">
            <Button className="w-full bg-primary text-white py-6" size="lg">
              AUSWÄHLEN
            </Button>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-6 text-center">
        * Alle Preise inkl. MwSt. Angebote gültig bei Abschluss einer Mitgliedschaft mit der angegebenen Laufzeit.
      </p>
    </div>
  )
}

