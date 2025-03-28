import { createClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

export type MenuCategory = Database["public"]["Tables"]["menu_categories"]["Row"]
export type MenuCategoryInsert = Database["public"]["Tables"]["menu_categories"]["Insert"]
export type MenuCategoryUpdate = Database["public"]["Tables"]["menu_categories"]["Update"]

export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"]
export type MenuItemInsert = Database["public"]["Tables"]["menu_items"]["Insert"]
export type MenuItemUpdate = Database["public"]["Tables"]["menu_items"]["Update"]

/**
 * Fetches all menu categories
 * @returns Promise with an array of menu categories
 */
export async function getAllMenuCategories(): Promise<{ data: MenuCategory[]; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("menu_categories").select("*").order("order", { ascending: true })

    if (error) {
      console.error("Error fetching menu categories:", error)
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Error in getAllMenuCategories:", error)
    return { data: [], error: "Failed to fetch menu categories" }
  }
}

/**
 * Creates a new menu category
 * @param category The menu category data to insert
 * @returns Promise with the created menu category
 */
export async function createMenuCategory(
  category: MenuCategoryInsert,
): Promise<{ data: MenuCategory | null; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("menu_categories").insert(category).select().single()

    if (error) {
      console.error("Error creating menu category:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in createMenuCategory:", error)
    return { data: null, error: "Failed to create menu category" }
  }
}

/**
 * Updates an existing menu category
 * @param id The menu category ID
 * @param category The menu category data to update
 * @returns Promise with the updated menu category
 */
export async function updateMenuCategory(
  id: string,
  category: MenuCategoryUpdate,
): Promise<{ data: MenuCategory | null; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("menu_categories").update(category).eq("id", id).select().single()

    if (error) {
      console.error(`Error updating menu category with ID ${id}:`, error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in updateMenuCategory:", error)
    return { data: null, error: "Failed to update menu category" }
  }
}

/**
 * Deletes a menu category
 * @param id The menu category ID
 * @returns Promise with success status
 */
export async function deleteMenuCategory(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("menu_categories").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting menu category with ID ${id}:`, error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error in deleteMenuCategory:", error)
    return { success: false, error: "Failed to delete menu category" }
  }
}

/**
 * Fetches all menu items
 * @param categoryId Optional category ID to filter by
 * @returns Promise with an array of menu items
 */
export async function getAllMenuItems(categoryId?: string): Promise<{ data: MenuItem[]; error: string | null }> {
  try {
    const supabase = createClient()

    let query = supabase.from("menu_items").select("*").order("order", { ascending: true })

    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching menu items:", error)
      return { data: [], error: error.message }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error("Error in getAllMenuItems:", error)
    return { data: [], error: "Failed to fetch menu items" }
  }
}

/**
 * Creates a new menu item
 * @param item The menu item data to insert
 * @returns Promise with the created menu item
 */
export async function createMenuItem(item: MenuItemInsert): Promise<{ data: MenuItem | null; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("menu_items").insert(item).select().single()

    if (error) {
      console.error("Error creating menu item:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in createMenuItem:", error)
    return { data: null, error: "Failed to create menu item" }
  }
}

/**
 * Updates an existing menu item
 * @param id The menu item ID
 * @param item The menu item data to update
 * @returns Promise with the updated menu item
 */
export async function updateMenuItem(
  id: string,
  item: MenuItemUpdate,
): Promise<{ data: MenuItem | null; error: string | null }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("menu_items").update(item).eq("id", id).select().single()

    if (error) {
      console.error(`Error updating menu item with ID ${id}:`, error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in updateMenuItem:", error)
    return { data: null, error: "Failed to update menu item" }
  }
}

/**
 * Deletes a menu item
 * @param id The menu item ID
 * @returns Promise with success status
 */
export async function deleteMenuItem(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("menu_items").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting menu item with ID ${id}:`, error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error in deleteMenuItem:", error)
    return { success: false, error: "Failed to delete menu item" }
  }
}

