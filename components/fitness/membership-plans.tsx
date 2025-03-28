"use client"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

// Define types for memberships and benefits
type FitnessMembership = {
  id: string
  type: string
  duration: number
  price: number
  created_at: string
}

type FitnessMembershipBenefit = {
  id: string
  membership_type: string
  benefit: string
  created_at: string
}

// Mock data for development (will be replaced with actual API calls)
const mockMemberships: FitnessMembership[] = [
  { id: "1", type: "bronze", duration: 6, price: 109, created_at: new Date().toISOString() },
  { id: "2", type: "bronze", duration: 12, price: 89, created_at: new Date().toISOString() },
  { id: "3", type: "bronze", duration: 24, price: 69, created_at: new Date().toISOString() },
  { id: "4", type: "platinum", duration: 6, price: 180, created_at: new Date().toISOString() },
  { id: "5", type: "platinum", duration: 12, price: 170, created_at: new Date().toISOString() },
  { id: "6", type: "platinum", duration: 24, price: 150, created_at: new Date().toISOString() },
]

const mockBenefits: FitnessMembershipBenefit[] = [
  { id: "1", membership_type: "bronze", benefit: "Zugang zu allen Geräten", created_at: new Date().toISOString() },
  { id: "2", membership_type: "bronze", benefit: "Getränkeflat", created_at: new Date().toISOString() },
  { id: "3", membership_type: "bronze", benefit: "Umkleiden und Duschen", created_at: new Date().toISOString() },
  { id: "4", membership_type: "platinum", benefit: "Zugang zu allen Geräten", created_at: new Date().toISOString() },
  { id: "5", membership_type: "platinum", benefit: "Getränkeflat", created_at: new Date().toISOString() },
  { id: "6", membership_type: "platinum", benefit: "Umkleiden und Duschen", created_at: new Date().toISOString() },
  { id: "7", membership_type: "platinum", benefit: "Körperanalyse", created_at: new Date().toISOString() },
  { id: "8", membership_type: "platinum", benefit: "Wellness-Bereich", created_at: new Date().toISOString() },
  {
    id: "9",
    membership_type: "platinum",
    benefit: "Individueller Trainingsplan",
    created_at: new Date().toISOString(),
  },
  {
    id: "10",
    membership_type: "platinum",
    benefit: "1x Personal Training pro Monat",
    created_at: new Date().toISOString(),
  },
]

export function MembershipPlans() {
  const [memberships, setMemberships] = useState<FitnessMembership[]>([])
  const [benefits, setBenefits] = useState<FitnessMembershipBenefit[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDuration, setSelectedDuration] = useState("12")

  useEffect(() => {
    // Simulate API call with mock data
    const fetchData = async () => {
      setLoading(true)
      try {
        // In a real implementation, these would be API calls
        // const membershipsData = await getFitnessMemberships()
        // const benefitsData = await getFitnessMembershipBenefits()

        // Using mock data for now
        setMemberships(mockMemberships)
        setBenefits(mockBenefits)
      } catch (error) {
        console.error("Error fetching membership data:", error)
        toast({
          title: "Error",
          description: "Failed to load membership data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getMembershipsByTypeAndDuration = (type: string, duration: string) => {
    return memberships.find((m) => m.type === type && m.duration.toString() === duration)
  }

  const getBenefitsByType = (type: string) => {
    return benefits.filter((b) => b.membership_type === type)
  }

  return (
    <div className="w-full" id="memberships">
      <h2 className="text-3xl font-bold mb-6">Mitgliedschaften</h2>

      <Tabs defaultValue={selectedDuration} onValueChange={setSelectedDuration} className="w-full">
        <div className="flex flex-col items-center mb-8">
          <h3 className="text-xl font-medium mb-4">Laufzeit wählen:</h3>
          <TabsList>
            <TabsTrigger value="6">6 Monate</TabsTrigger>
            <TabsTrigger value="12">12 Monate</TabsTrigger>
            <TabsTrigger value="24">24 Monate</TabsTrigger>
          </TabsList>
        </div>

        {["6", "12", "24"].map((duration) => (
          <TabsContent key={duration} value={duration} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Bronze Membership */}
              <Card className="flex flex-col h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">Bronze Mitgliedschaft</CardTitle>
                  <CardDescription>Grundlegende Mitgliedschaft mit allen wesentlichen Funktionen</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-4xl font-bold mb-6">
                    {loading ? (
                      <span className="text-gray-300">--</span>
                    ) : (
                      <>
                        {getMembershipsByTypeAndDuration("bronze", duration)?.price || "--"}
                        <span className="text-lg font-normal text-gray-500"> €/Monat</span>
                      </>
                    )}
                  </div>
                  <div className="space-y-3">
                    {loading
                      ? Array(3)
                          .fill(0)
                          .map((_, i) => <div key={i} className="h-6 bg-gray-100 rounded animate-pulse"></div>)
                      : getBenefitsByType("bronze").map((benefit) => (
                          <div key={benefit.id} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                            <span>{benefit.benefit}</span>
                          </div>
                        ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Jetzt Mitglied werden</Button>
                </CardFooter>
              </Card>

              {/* Platinum Membership */}
              <Card className="flex flex-col h-full border-primary bg-primary/5">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl">Platinum Mitgliedschaft</CardTitle>
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">Empfohlen</span>
                  </div>
                  <CardDescription>
                    Premium-Mitgliedschaft mit allen Vorteilen und exklusiven Funktionen
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-4xl font-bold mb-6">
                    {loading ? (
                      <span className="text-gray-300">--</span>
                    ) : (
                      <>
                        {getMembershipsByTypeAndDuration("platinum", duration)?.price || "--"}
                        <span className="text-lg font-normal text-gray-500"> €/Monat</span>
                      </>
                    )}
                  </div>
                  <div className="space-y-3">
                    {loading
                      ? Array(5)
                          .fill(0)
                          .map((_, i) => <div key={i} className="h-6 bg-gray-100 rounded animate-pulse"></div>)
                      : getBenefitsByType("platinum").map((benefit) => (
                          <div key={benefit.id} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                            <span>{benefit.benefit}</span>
                          </div>
                        ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="default">
                    Jetzt Mitglied werden
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

