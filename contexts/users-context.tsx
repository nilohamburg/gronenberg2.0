"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getUsers, updateUser, deleteUser, addUser } from "@/actions/users"

export interface UserProps {
  id: string
  name: string
  email: string
  role: "admin" | "staff" | "guest"
  status: "active" | "inactive"
  lastLogin: Date | null
  createdAt: Date
}

interface UsersContextType {
  users: UserProps[]
  loading: boolean
  updateUser: (user: UserProps) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  addUser: (user: Omit<UserProps, "id" | "createdAt" | "lastLogin">) => Promise<void>
}

const UsersContext = createContext<UsersContextType | undefined>(undefined)

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserProps[]>([])
  const [loading, setLoading] = useState(true)

  // Load users from Supabase
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers()
        setUsers(data)
      } catch (error) {
        console.error("Failed to load users:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Update a user
  const updateUserHandler = async (updatedUser: UserProps) => {
    try {
      await updateUser(updatedUser)

      // Update local state
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
    } catch (error) {
      console.error("Failed to update user:", error)
      throw error
    }
  }

  // Delete a user
  const deleteUserHandler = async (id: string) => {
    try {
      await deleteUser(id)

      // Update local state
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id))
    } catch (error) {
      console.error("Failed to delete user:", error)
      throw error
    }
  }

  // Add a new user
  const addUserHandler = async (newUser: Omit<UserProps, "id" | "createdAt" | "lastLogin">) => {
    try {
      const { id } = await addUser(newUser)

      // Update local state
      const userWithId = {
        ...newUser,
        id,
        lastLogin: null,
        createdAt: new Date(),
      } as UserProps

      setUsers((prevUsers) => [userWithId, ...prevUsers])
    } catch (error) {
      console.error("Failed to add user:", error)
      throw error
    }
  }

  return (
    <UsersContext.Provider
      value={{
        users,
        loading,
        updateUser: updateUserHandler,
        deleteUser: deleteUserHandler,
        addUser: addUserHandler,
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}

export function useUsers() {
  const context = useContext(UsersContext)
  if (context === undefined) {
    throw new Error("useUsers must be used within a UsersProvider")
  }
  return context
}

