"use server"

import { createServerComponentClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Define types
export interface MenuCategory {
  id: number
  name: string
  description?: string
  order_index: number
}

export interface MenuItem {
  id: number
  category_id: number
  name: string
  description: string
  price: string
  is_vegan: boolean
  is_lactose_free: boolean
  is_gluten_free: boolean
  image?: string
  order_index: number
}

// Get all menu categories
export async function getMenuCategories() {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("menu_categories").select("*").order("order_index", { ascending: true })

  if (error) {
    console.error("Error fetching menu categories:", error)
    throw new Error("Failed to fetch menu categories")
  }

  return data as MenuCategory[]
}

// Get menu category by ID
export async function getMenuCategoryById(id: number) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("menu_categories").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching menu category with id ${id}:`, error)
    throw new Error("Failed to fetch menu category")
  }

  return data as MenuCategory
}

// Create a new menu category
export async function createMenuCategory(category: Omit<MenuCategory, "id">) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("menu_categories").insert(category).select("id").single()

  if (error) {
    console.error("Error creating menu category:", error)
    throw new Error("Failed to create menu category")
  }

  revalidatePath("/admin/restaurants")
  revalidatePath("/dining/muhle-restaurant")

  return { success: true, id: data.id }
}

// Update a menu category
export async function updateMenuCategory(category: MenuCategory) {
  const supabase = createServerComponentClient()

  const { error } = await supabase
    .from("menu_categories")
    .update({
      name: category.name,
      description: category.description,
      order_index: category.order_index,
    })
    .eq("id", category.id)

  if (error) {
    console.error("Error updating menu category:", error)
    throw new Error("Failed to update menu category")
  }

  revalidatePath("/admin/restaurants")
  revalidatePath("/dining/muhle-restaurant")

  return { success: true }
}

// Delete a menu category
export async function deleteMenuCategory(id: number) {
  const supabase = createServerComponentClient()

  const { error } = await supabase.from("menu_categories").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting menu category with id ${id}:`, error)
    throw new Error("Failed to delete menu category")
  }

  revalidatePath("/admin/restaurants")
  revalidatePath("/dining/muhle-restaurant")

  return { success: true }
}

// Get all menu items
export async function getMenuItems(categoryId?: number) {
  const supabase = createServerComponentClient()

  let query = supabase
    .from("menu_items")
    .select(`
      *,
      menu_categories(id, name)
    `)
    .order("order_index", { ascending: true })

  if (categoryId) {
    query = query.eq("category_id", categoryId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching menu items:", error)
    throw new Error("Failed to fetch menu items")
  }

  return data.map((item: any) => ({
    id: item.id,
    category_id: item.category_id,
    categoryName: item.menu_categories?.name || "Unknown Category",
    name: item.name,
    description: item.description,
    price: item.price,
    is_vegan: item.is_vegan,
    is_lactose_free: item.is_lactose_free,
    is_gluten_free: item.is_gluten_free,
    image: item.image,
    order_index: item.order_index,
  }))
}

// Get menu item by ID
export async function getMenuItemById(id: number) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase
    .from("menu_items")
    .select(`
      *,
      menu_categories(id, name)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching menu item with id ${id}:`, error)
    throw new Error("Failed to fetch menu item")
  }

  return {
    id: data.id,
    category_id: data.category_id,
    categoryName: data.menu_categories?.name || "Unknown Category",
    name: data.name,
    description: data.description,
    price: data.price,
    is_vegan: data.is_vegan,
    is_lactose_free: data.is_lactose_free,
    is_gluten_free: data.is_gluten_free,
    image: data.image,
    order_index: data.order_index,
  }
}

// Create a new menu item
export async function createMenuItem(item: Omit<MenuItem, "id">) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("menu_items").insert(item).select("id").single()

  if (error) {
    console.error("Error creating menu item:", error)
    throw new Error("Failed to create menu item")
  }

  revalidatePath("/admin/restaurants")
  revalidatePath("/dining/muhle-restaurant")

  return { success: true, id: data.id }
}

// Update a menu item
export async function updateMenuItem(item: MenuItem) {
  const supabase = createServerComponentClient()

  const { error } = await supabase
    .from("menu_items")
    .update({
      category_id: item.category_id,
      name: item.name,
      description: item.description,
      price: item.price,
      is_vegan: item.is_vegan,
      is_lactose_free: item.is_lactose_free,
      is_gluten_free: item.is_gluten_free,
      image: item.image,
      order_index: item.order_index,
    })
    .eq("id", item.id)

  if (error) {
    console.error("Error updating menu item:", error)
    throw new Error("Failed to update menu item")
  }

  revalidatePath("/admin/restaurants")
  revalidatePath("/dining/muhle-restaurant")

  return { success: true }
}

// Delete a menu item
export async function deleteMenuItem(id: number) {
  const supabase = createServerComponentClient()

  const { error } = await supabase.from("menu_items").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting menu item with id ${id}:`, error)
    throw new Error("Failed to delete menu item")
  }

  revalidatePath("/admin/restaurants")
  revalidatePath("/dining/muhle-restaurant")

  return { success: true }
}

// Get full menu with categories and items
export async function getFullMenu() {
  const supabase = createServerComponentClient()

  const { data: categories, error: categoriesError } = await supabase
    .from("menu_categories")
    .select("*")
    .order("order_index", { ascending: true })

  if (categoriesError) {
    console.error("Error fetching menu categories:", categoriesError)
    throw new Error("Failed to fetch menu categories")
  }

  const { data: items, error: itemsError } = await supabase
    .from("menu_items")
    .select("*")
    .order("order_index", { ascending: true })

  if (itemsError) {
    console.error("Error fetching menu items:", itemsError)
    throw new Error("Failed to fetch menu items")
  }

  // Group items by category
  const menu = categories.map((category: MenuCategory) => {
    const categoryItems = items.filter((item: MenuItem) => item.category_id === category.id)
    return {
      ...category,
      items: categoryItems,
    }
  })

  return menu
}

