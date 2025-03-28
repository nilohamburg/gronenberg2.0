"use client"

import { Button } from "@/components/ui/button"

export function FitnessHero() {
  const scrollToTrialForm = () => {
    const trialForm = document.getElementById("probetraining")
    if (trialForm) {
      trialForm.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="relative h-[70vh] min-h-[500px] bg-gradient-to-r from-blue-900 to-blue-700 flex items-center">
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://www.daswell.de/wp-content/uploads/go-x/u/4a7331e8-2806-4085-97de-633b7671cd73/image.jpg')",
          backgroundPosition: "center 30%",
        }}
      ></div>
      <div className="container mx-auto px-4 relative z-20 text-white pt-20">
        {" "}
        {/* Added pt-20 to push content down below navbar */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Fitness in der Gronenberger Mühle</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          Entdecken Sie unser modernes Fitnessstudio mit vielfältigen Kursen und Trainingsmöglichkeiten.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button size="lg" onClick={scrollToTrialForm} className="bg-white text-blue-900 hover:bg-gray-100">
            Probetraining buchen
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            Mehr erfahren
          </Button>
        </div>
      </div>
    </div>
  )
}

