"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import {
  getFitnessMemberships,
  getFitnessMembershipBenefits,
  updateFitnessMembership,
  createFitnessMembershipBenefit,
  deleteFitnessMembershipBenefit,
  type FitnessMembership,
  type FitnessMembershipBenefit,
} from "@/actions/fitness-memberships"

export function FitnessMembershipsManagement() {
  const [memberships, setMemberships] = useState<FitnessMembership[]>([])
  const [benefits, setBenefits] = useState<FitnessMembershipBenefit[]>([])
  const [loading, setLoading] = useState(true)
  const [editingMembership, setEditingMembership] = useState<FitnessMembership | null>(null)
  const [price, setPrice] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddBenefitDialogOpen, setIsAddBenefitDialogOpen] = useState(false)
  const [newBenefit, setNewBenefit] = useState("")
  const [selectedMembershipType, setSelectedMembershipType] = useState<string>("bronze")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const membershipsData = await getFitnessMemberships()
      const benefitsData = await getFitnessMembershipBenefits()

      setMemberships(membershipsData)
      setBenefits(benefitsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load membership data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditMembership = (membership: FitnessMembership) => {
    setEditingMembership(membership)
    setPrice(membership.price.toString())
    setIsEditDialogOpen(true)
  }

  const handleSaveMembership = async () => {
    if (!editingMembership) return

    try {
      await updateFitnessMembership(editingMembership.id, {
        price: Number.parseFloat(price),
      })

      toast({
        title: "Success",
        description: "Membership price updated successfully",
      })

      fetchData()
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating membership:", error)
      toast({
        title: "Error",
        description: "Failed to update membership price",
        variant: "destructive",
      })
    }
  }

  const handleAddBenefit = async () => {
    if (!newBenefit.trim()) return

    try {
      await createFitnessMembershipBenefit({
        membership_type: selectedMembershipType,
        benefit: newBenefit.trim(),
      })

      toast({
        title: "Success",
        description: "Benefit added successfully",
      })

      fetchData()
      setNewBenefit("")
      setIsAddBenefitDialogOpen(false)
    } catch (error) {
      console.error("Error adding benefit:", error)
      toast({
        title: "Error",
        description: "Failed to add benefit",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBenefit = async (id: string) => {
    if (!confirm("Are you sure you want to delete this benefit?")) return

    try {
      await deleteFitnessMembershipBenefit(id)

      toast({
        title: "Success",
        description: "Benefit deleted successfully",
      })

      fetchData()
    } catch (error) {
      console.error("Error deleting benefit:", error)
      toast({
        title: "Error",
        description: "Failed to delete benefit",
        variant: "destructive",
      })
    }
  }

  const getBenefitsByType = (type: string) => {
    return benefits.filter((benefit) => benefit.membership_type === type)
  }

  const getMembershipsByType = (type: string) => {
    return memberships.filter((membership) => membership.type === type)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mitgliedschaften verwalten</h2>
        <Button
          onClick={() => {
            setIsAddBenefitDialogOpen(true)
          }}
        >
          Vorteil hinzufügen
        </Button>
      </div>

      <Tabs defaultValue="bronze" onValueChange={setSelectedMembershipType}>
        <TabsList>
          <TabsTrigger value="bronze">Bronze</TabsTrigger>
          <TabsTrigger value="platinum">Platinum</TabsTrigger>
        </TabsList>

        {["bronze", "platinum"].map((type) => (
          <TabsContent key={type} value={type} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{type} Mitgliedschaft</CardTitle>
                <CardDescription>Preise und Laufzeiten für die {type} Mitgliedschaft verwalten</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Laufzeit</TableHead>
                      <TableHead>Preis (€/Monat)</TableHead>
                      <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          Lädt...
                        </TableCell>
                      </TableRow>
                    ) : getMembershipsByType(type).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          Keine Mitgliedschaften gefunden
                        </TableCell>
                      </TableRow>
                    ) : (
                      getMembershipsByType(type).map((membership) => (
                        <TableRow key={membership.id}>
                          <TableCell>{membership.duration} Monate</TableCell>
                          <TableCell>{membership.price} €</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => handleEditMembership(membership)}>
                              Bearbeiten
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vorteile</CardTitle>
                <CardDescription>Vorteile für die {type} Mitgliedschaft verwalten</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">Lädt...</div>
                ) : getBenefitsByType(type).length === 0 ? (
                  <div className="text-center py-4">Keine Vorteile gefunden</div>
                ) : (
                  <div className="space-y-2">
                    {getBenefitsByType(type).map((benefit) => (
                      <div key={benefit.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{benefit.benefit}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteBenefit(benefit.id)}
                        >
                          Löschen
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Membership Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mitgliedschaftspreis bearbeiten</DialogTitle>
            <DialogDescription>
              Aktualisieren Sie den Preis für die {editingMembership?.type} Mitgliedschaft mit{" "}
              {editingMembership?.duration} Monaten Laufzeit.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preis (€/Monat)</Label>
              <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSaveMembership}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Benefit Dialog */}
      <Dialog open={isAddBenefitDialogOpen} onOpenChange={setIsAddBenefitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vorteil hinzufügen</DialogTitle>
            <DialogDescription>
              Fügen Sie einen neuen Vorteil für die {selectedMembershipType} Mitgliedschaft hinzu.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="membershipType">Mitgliedschaftstyp</Label>
              <select
                id="membershipType"
                className="w-full p-2 border rounded"
                value={selectedMembershipType}
                onChange={(e) => setSelectedMembershipType(e.target.value)}
              >
                <option value="bronze">Bronze</option>
                <option value="platinum">Platinum</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="benefit">Vorteil</Label>
              <Input
                id="benefit"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="z.B. Getränkeflat"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddBenefitDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleAddBenefit}>Hinzufügen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

