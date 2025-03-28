"use client"

import { Dumbbell, Users, Calendar, Award } from "lucide-react"

export function FitnessHighlights() {
  const highlights = [
    {
      icon: <Dumbbell className="h-10 w-10 text-blue-600" />,
      title: "Moderne Geräte",
      description: "Trainieren Sie mit den neuesten Fitnessgeräten für ein effektives Workout.",
    },
    {
      icon: <Users className="h-10 w-10 text-blue-600" />,
      title: "Professionelle Trainer",
      description: "Unsere erfahrenen Trainer unterstützen Sie bei Ihren Fitnesszielen.",
    },
    {
      icon: <Calendar className="h-10 w-10 text-blue-600" />,
      title: "Vielfältige Kurse",
      description: "Von Yoga bis HIIT - wir bieten Kurse für jeden Geschmack und jedes Fitnesslevel.",
    },
    {
      icon: <Award className="h-10 w-10 text-blue-600" />,
      title: "Persönliche Betreuung",
      description: "Individuelle Trainingspläne und regelmäßige Fortschrittschecks.",
    },
  ]

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-10 text-center">Unser Angebot</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {highlights.map((highlight, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-4">{highlight.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{highlight.title}</h3>
            <p className="text-gray-600">{highlight.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

