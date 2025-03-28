"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Leaf, Milk, Wheat, AlertCircle } from "lucide-react"
import { getFullMenu } from "@/actions/menu"

type MenuItem = {
  id: number
  name: string
  description: string
  price: string
  is_vegan: boolean
  is_lactose_free: boolean
  is_gluten_free: boolean
  image?: string
  order_index: number
}

type MenuCategory = {
  id: number
  name: string
  description?: string
  order_index: number
  items: MenuItem[]
}

export function FullMenuDisplay() {
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([])
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true)
        const menu = await getFullMenu()
        setMenuCategories(menu)

        // Set the first category as active if available
        if (menu.length > 0) {
          setActiveCategory(menu[0].id)
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching menu:", err)
        setError("Failed to load menu. Please try again later.")
        setLoading(false)
      }
    }

    fetchMenu()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-500 mb-2">Error Loading Menu</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  if (menuCategories.length === 0) {
    return (
      <div className="max-w-5xl mx-auto text-center py-12">
        <h2 className="text-4xl font-bold mb-4">Unsere Speisekarte</h2>
        <p className="text-gray-600">Unser Menü wird bald verfügbar sein. Bitte schauen Sie später wieder vorbei.</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-10">Unsere Speisekarte</h2>

      {/* Category Tabs */}
      <div className="flex flex-wrap border border-gray-200 rounded-lg mb-8 overflow-hidden">
        {menuCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex-1 py-3 px-4 text-center transition-colors ${
              activeCategory === category.id ? "bg-white font-medium" : "bg-gray-100 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="space-y-6">
        {activeCategory !== null &&
          menuCategories
            .find((category) => category.id === activeCategory)
            ?.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg overflow-hidden"
              >
                <div className="bg-gray-200 h-48 relative">
                  <Image
                    src={item.image || "/placeholder.svg?height=200&width=200&text=" + encodeURIComponent(item.name)}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-medium flex items-center">
                      {item.name}
                      <div className="flex ml-2">
                        {item.is_vegan && (
                          <span className="text-green-500 mr-1" title="Vegan">
                            <Leaf size={16} />
                          </span>
                        )}
                        {item.is_lactose_free && (
                          <span className="text-blue-500 mr-1" title="Laktosefrei">
                            <Milk size={16} />
                          </span>
                        )}
                        {item.is_gluten_free && (
                          <span className="text-amber-500 mr-1" title="Glutenfrei">
                            <Wheat size={16} />
                          </span>
                        )}
                      </div>
                    </h3>
                    <span className="text-lg font-medium">{item.price}</span>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}

