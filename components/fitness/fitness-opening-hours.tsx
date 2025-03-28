"use client"

import { Clock } from "lucide-react"

export function FitnessOpeningHours() {
  const weekdayHours = [
    { day: "Montag", hours: "06:00 - 22:00 Uhr" },
    { day: "Dienstag", hours: "06:00 - 22:00 Uhr" },
    { day: "Mittwoch", hours: "06:00 - 22:00 Uhr" },
    { day: "Donnerstag", hours: "06:00 - 22:00 Uhr" },
    { day: "Freitag", hours: "06:00 - 22:00 Uhr" },
    { day: "Samstag", hours: "08:00 - 20:00 Uhr" },
    { day: "Sonntag", hours: "08:00 - 20:00 Uhr" },
  ]

  return (
    <div className="w-full py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-center flex items-center">
            <Clock className="mr-2 h-8 w-8 text-blue-600" />
            Öffnungszeiten
          </h2>
          <p className="text-gray-600 text-center max-w-2xl">
            Unser Fitnessstudio bietet flexible Öffnungszeiten, damit Sie Ihr Training optimal in Ihren Alltag
            integrieren können.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
          <div className="md:flex">
            {/* Linke Spalte: Tägliche Öffnungszeiten */}
            <div className="md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Reguläre Zeiten</h3>
              <div className="space-y-3">
                {weekdayHours.map((item) => (
                  <div key={item.day} className="flex justify-between">
                    <span className="font-medium">{item.day}</span>
                    <span className="text-gray-600">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rechte Spalte: Besondere Hinweise */}
            <div className="md:w-1/2 p-6">
              <h3 className="text-xl font-semibold mb-4">Besondere Hinweise</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Feiertage</p>
                  <p className="text-gray-600">Öffnungszeiten wie am Sonntag</p>
                </div>
                <div>
                  <p className="font-medium">Kurse</p>
                  <p className="text-gray-600">Teilnahme nur nach vorheriger Anmeldung</p>
                </div>
                <div>
                  <p className="font-medium">Sauna</p>
                  <p className="text-gray-600">Täglich von 10:00 bis 21:00 Uhr geöffnet</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fussnote für Platinum-Mitgliedschaft */}
          <div className="bg-blue-50 p-4 border-t border-blue-100">
            <p className="text-center text-blue-800 text-sm">
              <span className="font-bold">Platinum-Mitgliedschaft:</span> Genießen Sie 24/7 Zugang zum Fitnessstudio
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

