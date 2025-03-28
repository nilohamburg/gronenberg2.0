"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"

export function ReservationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    guests: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission (e.g., API call)
    console.log("Form submitted:", formData)
    alert("Reservation request submitted! We'll contact you shortly to confirm.")
  }

  return (
    <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="px-4 py-2 rounded-md text-gray-800 w-full"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="px-4 py-2 rounded-md text-gray-800 w-full"
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="px-4 py-2 rounded-md text-gray-800 w-full"
          required
        />
        <select
          name="guests"
          value={formData.guests}
          onChange={handleChange}
          className="px-4 py-2 rounded-md text-gray-800 w-full"
          required
        >
          <option value="">Number of Guests</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <option key={num} value={num.toString()}>
              {num} {num === 1 ? "Guest" : "Guests"}
            </option>
          ))}
          <option value="9+">9+ Guests</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-white text-primary hover:bg-secondary/20 px-8 py-3 rounded-md font-medium transition-colors w-full"
      >
        Request Reservation
      </button>
    </form>
  )
}

export function MenuHighlights() {
  const dishes = [
    {
      name: "Ostsee Fischsuppe",
      description: "Fresh Baltic Sea fish soup with local herbs and vegetables",
      price: "€14",
      image: "/placeholder.svg?height=300&width=400&text=Fish+Soup",
    },
    {
      name: "Holsteiner Rind",
      description: "Grilled Holstein beef with roasted root vegetables and red wine jus",
      price: "€28",
      image: "/placeholder.svg?height=300&width=400&text=Beef+Dish",
    },
    {
      name: "Apfel Strudel",
      description: "Traditional apple strudel with vanilla sauce and cinnamon ice cream",
      price: "€9",
      image: "/placeholder.svg?height=300&width=400&text=Apple+Strudel",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {dishes.map((dish, index) => (
        <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
          <Image
            src={dish.image || "/placeholder.svg"}
            alt={dish.name}
            width={400}
            height={300}
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold">{dish.name}</h3>
              <span className="text-primary font-medium">{dish.price}</span>
            </div>
            <p className="text-gray-600">{dish.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export function RestaurantGallery() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <Image
            src={`/placeholder.svg?height=300&width=400&text=Gallery+Image+${index + 1}`}
            alt={`Restaurant Gallery Image ${index + 1}`}
            width={400}
            height={300}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  )
}

