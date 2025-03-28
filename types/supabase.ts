export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: "admin" | "staff" | "guest"
          status: "active" | "inactive"
          last_login: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          role: "admin" | "staff" | "guest"
          status: "active" | "inactive"
          last_login?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: "admin" | "staff" | "guest"
          status?: "active" | "inactive"
          last_login?: string | null
          created_at?: string
        }
      }
      houses: {
        Row: {
          id: number
          name: string
          description: string | null
          capacity: number
          price: number
          image_url: string | null
          dogs_allowed: boolean
          sea_view: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          capacity: number
          price: number
          image_url?: string | null
          dogs_allowed?: boolean
          sea_view?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          capacity?: number
          price?: number
          image_url?: string | null
          dogs_allowed?: boolean
          sea_view?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      amenities: {
        Row: {
          id: number
          name: string
          icon: string | null
          description: string | null
        }
        Insert: {
          id?: number
          name: string
          icon?: string | null
          description?: string | null
        }
        Update: {
          id?: number
          name?: string
          icon?: string | null
          description?: string | null
        }
      }
      house_amenities: {
        Row: {
          house_id: number
          amenity_id: number
        }
        Insert: {
          house_id: number
          amenity_id: number
        }
        Update: {
          house_id?: number
          amenity_id?: number
        }
      }
      bookings: {
        Row: {
          id: string
          guest_name: string
          guest_email: string
          house_id: number | null
          check_in: string
          check_out: string
          guests: number
          total_price: number
          status: "confirmed" | "pending" | "cancelled" | "completed"
          payment_status: "paid" | "pending" | "refunded"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          guest_name: string
          guest_email: string
          house_id?: number | null
          check_in: string
          check_out: string
          guests: number
          total_price: number
          status: "confirmed" | "pending" | "cancelled" | "completed"
          payment_status: "paid" | "pending" | "refunded"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          guest_name?: string
          guest_email?: string
          house_id?: number | null
          check_in?: string
          check_out?: string
          guests?: number
          total_price?: number
          status?: "confirmed" | "pending" | "cancelled" | "completed"
          payment_status?: "paid" | "pending" | "refunded"
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

