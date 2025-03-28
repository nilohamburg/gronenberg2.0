"use server"

import { createServerComponentClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function getUsers() {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
    throw new Error("Failed to fetch users")
  }

  // Transform the data to match the expected format
  const users = data.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    lastLogin: user.last_login ? new Date(user.last_login) : null,
    createdAt: new Date(user.created_at),
  }))

  return users
}

export async function getUserById(id: string) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching user with id ${id}:`, error)
    throw new Error("Failed to fetch user")
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    status: data.status,
    lastLogin: data.last_login ? new Date(data.last_login) : null,
    createdAt: new Date(data.created_at),
  }
}

export async function updateUser(user: {
  id: string
  name: string
  email: string
  role: "admin" | "staff" | "guest"
  status: "active" | "inactive"
}) {
  const supabase = createServerComponentClient()

  const { error } = await supabase
    .from("users")
    .update({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    })
    .eq("id", user.id)

  if (error) {
    console.error("Error updating user:", error)
    throw new Error("Failed to update user")
  }

  revalidatePath("/admin/users")

  return { success: true }
}

export async function deleteUser(id: string) {
  const supabase = createServerComponentClient()

  const { error } = await supabase.from("users").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting user with id ${id}:`, error)
    throw new Error("Failed to delete user")
  }

  revalidatePath("/admin/users")

  return { success: true }
}

export async function addUser(user: {
  name: string
  email: string
  role: "admin" | "staff" | "guest"
  status: "active" | "inactive"
}) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase
    .from("users")
    .insert({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user")
  }

  revalidatePath("/admin/users")

  return { success: true, id: data.id }
}

export async function updateLastLogin(id: string) {
  const supabase = createServerComponentClient()

  const { error } = await supabase
    .from("users")
    .update({
      last_login: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error(`Error updating last login for user ${id}:`, error)
    throw new Error("Failed to update last login")
  }

  return { success: true }
}

