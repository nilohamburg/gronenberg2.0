

import { createClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export type FitnessMembership = {
  id: string
  type: string
  duration: number
  price: number
  created_at: string
  updated_at: string
}

export type FitnessMembershipBenefit = {
  id: string
  membership_type: string
  benefit: string
}

export async function getFitnessMemberships() {
  const supabase = createClient()

  const { data, error } = await supabase.from("fitness_memberships").select("*").order("type").order("duration")

  if (error) {
    console.error("Error fetching fitness memberships:", error)
    throw new Error("Failed to fetch fitness memberships")
  }

  return data as FitnessMembership[]
}

export async function getFitnessMembershipBenefits(membershipType?: string) {
  const supabase = createClient()

  let query = supabase.from("fitness_membership_benefits").select("*")

  if (membershipType) {
    query = query.eq("membership_type", membershipType)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching fitness membership benefits:", error)
    throw new Error("Failed to fetch fitness membership benefits")
  }

  return data as FitnessMembershipBenefit[]
}

export async function updateFitnessMembership(id: string, membership: Partial<FitnessMembership>) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("fitness_memberships")
    .update({
      ...membership,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating fitness membership:", error)
    throw new Error("Failed to update fitness membership")
  }

  revalidatePath("/admin/fitness")
  revalidatePath("/fitness")

  return data[0] as FitnessMembership
}

export async function createFitnessMembershipBenefit(benefit: Omit<FitnessMembershipBenefit, "id">) {
  const supabase = createClient()

  const { data, error } = await supabase.from("fitness_membership_benefits").insert([benefit]).select()

  if (error) {
    console.error("Error creating fitness membership benefit:", error)
    throw new Error("Failed to create fitness membership benefit")
  }

  revalidatePath("/admin/fitness")
  revalidatePath("/fitness")

  return data[0] as FitnessMembershipBenefit
}

export async function deleteFitnessMembershipBenefit(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("fitness_membership_benefits").delete().eq("id", id)

  if (error) {
    console.error("Error deleting fitness membership benefit:", error)
    throw new Error("Failed to delete fitness membership benefit")
  }

  revalidatePath("/admin/fitness")
  revalidatePath("/fitness")

  return { success: true }
}

export async function createFitnessMembership(membership: Omit<FitnessMembership, "id" | "created_at" | "updated_at">) {
  const supabase = createClient()

  const { data, error } = await supabase.from("fitness_memberships").insert([membership]).select()

  if (error) {
    console.error("Error creating fitness membership:", error)
    throw new Error("Failed to create fitness membership")
  }

  revalidatePath("/admin/fitness")
  revalidatePath("/fitness")

  return data[0] as FitnessMembership
}

