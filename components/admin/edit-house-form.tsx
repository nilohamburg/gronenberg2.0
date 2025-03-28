"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { useHouses } from "@/hooks/use-houses"
import type { RoomProps } from "@/components/room-card"
import { ArrowLeft, Plus, Trash, Upload } from "lucide-react"

interface EditHouseFormProps {
  houseId: number
}

export function EditHouseForm({ houseId }: EditHouseFormProps) {
  const router = useRouter()
  const { isAuthenticated } = useAdminAuth()
  const { houses, updateHouse } = useHouses()
  const [house, setHouse] = useState<RoomProps | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  // Mock image gallery
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (houses) {
      const foundHouse = houses.find((h) => h.id === houseId)
      if (foundHouse) {
        setHouse(foundHouse)
        // Mock images based on the house
        setImages([
          foundHouse.image,
          `/placeholder.svg?height=400&width=600&text=Interior ${foundHouse.id}`,
          `/placeholder.svg?height=400&width=600&text=Bathroom ${foundHouse.id}`,
          `/placeholder.svg?height=400&width=600&text=View ${foundHouse.id}`,
        ])
      }
      setLoading(false)
    }
  }, [houses, houseId])

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!house) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">House Not Found</h2>
        <p className="text-muted-foreground mb-6">The house you're looking for doesn't exist.</p>
        <Button onClick={() => router.push("/admin/houses")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Houses
        </Button>
      </div>
    )
  }

  // Ensure the input handlers correctly update the state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setHouse((prev) => {
      if (!prev) return prev
      return { ...prev, [name]: value }
    })
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setHouse((prev) => {
      if (!prev) return prev
      return { ...prev, [name]: Number(value) }
    })
  }

  const handleToggleChange = (name: string, checked: boolean) => {
    setHouse((prev) => {
      if (!prev) return prev
      return { ...prev, [name]: checked }
    })
  }

  const handleAmenityToggle = (amenity: string) => {
    setHouse((prev) => {
      if (!prev) return prev

      const currentAmenities = [...prev.amenities]
      const index = currentAmenities.indexOf(amenity)

      if (index >= 0) {
        currentAmenities.splice(index, 1)
      } else {
        currentAmenities.push(amenity)
      }

      return { ...prev, amenities: currentAmenities }
    })
  }

  // Fix the handleSave function to properly handle form submission
  const handleSave = async () => {
    if (!house) return

    setSaving(true)
    try {
      // Make sure we're passing the complete house object
      await updateHouse({ ...house })
      // Show success message
      alert("House updated successfully!")
      router.push("/admin/houses")
    } catch (error) {
      console.error("Failed to save house:", error)
      alert("Failed to update house. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddImage = () => {
    // In a real app, this would open a file picker
    const newImage = `/placeholder.svg?height=400&width=600&text=New Image ${Date.now()}`
    setImages((prev) => [...prev, newImage])
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/houses")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit House</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/houses")}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="features">Features & Amenities</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">House Name</Label>
                <Input id="name" name="name" value={house.name} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={house.description}
                  onChange={handleInputChange}
                  rows={5}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (People)</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min={1}
                  max={10}
                  value={house.capacity}
                  onChange={handleNumberChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price per Night (€)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min={50}
                  step={10}
                  value={house.price}
                  onChange={handleNumberChange}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Main Features</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="seaView" className="cursor-pointer">
                      Sea View
                    </Label>
                    <Switch
                      id="seaView"
                      checked={house.seaView}
                      onCheckedChange={(checked) => handleToggleChange("seaView", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="dogsAllowed" className="cursor-pointer">
                      Pet Friendly
                    </Label>
                    <Switch
                      id="dogsAllowed"
                      checked={house.dogsAllowed}
                      onCheckedChange={(checked) => handleToggleChange("dogsAllowed", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Amenities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "WiFi",
                    "Kaffeemaschine",
                    "TV",
                    "Fireplace",
                    "Private Garden",
                    "Balcony",
                    "Air Conditioning",
                    "Heating",
                    "Safe",
                  ].map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${amenity}`}
                        checked={house.amenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityToggle(amenity)}
                      />
                      <Label htmlFor={`amenity-${amenity}`} className="cursor-pointer">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-6 pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">House Images</h3>
            <Button onClick={handleAddImage} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="relative aspect-video overflow-hidden rounded-md border">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`House image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-md">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-white text-black hover:bg-gray-100">
                      <Upload className="h-4 w-4 mr-2" />
                      Replace
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteImage(index)}>
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
                {index === 0 && <Badge className="absolute top-2 left-2 bg-primary">Main Image</Badge>}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

