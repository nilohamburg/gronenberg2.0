import { createClient } from "@/lib/supabase"

export type FileUploadResult = {
  path: string
  url: string
  error?: string
}

/**
 * Uploads a file to Supabase Storage
 * @param file The file to upload
 * @param bucket The storage bucket name
 * @param path Optional path within the bucket
 * @returns Promise with the file path and URL
 */
export async function uploadFile(file: File, bucket: string, path?: string): Promise<FileUploadResult> {
  try {
    const supabase = createClient()

    // Create a unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const filePath = path ? `${path}/${fileName}` : fileName

    // Upload the file
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Error uploading file:", error)
      return { path: "", url: "", error: error.message }
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return { path: data.path, url: publicUrl }
  } catch (error) {
    console.error("Error in uploadFile:", error)
    return { path: "", url: "", error: "Failed to upload file" }
  }
}

/**
 * Deletes a file from Supabase Storage
 * @param path The file path
 * @param bucket The storage bucket name
 * @returns Promise with success status
 */
export async function deleteFile(path: string, bucket: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      console.error("Error deleting file:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteFile:", error)
    return { success: false, error: "Failed to delete file" }
  }
}

/**
 * Creates a signed URL for temporary access to a file
 * @param path The file path
 * @param bucket The storage bucket name
 * @param expiresIn Expiration time in seconds (default: 60)
 * @returns Promise with the signed URL
 */
export async function getSignedUrl(
  path: string,
  bucket: string,
  expiresIn = 60,
): Promise<{ signedUrl: string; error?: string }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

    if (error) {
      console.error("Error creating signed URL:", error)
      return { signedUrl: "", error: error.message }
    }

    return { signedUrl: data.signedUrl }
  } catch (error) {
    console.error("Error in getSignedUrl:", error)
    return { signedUrl: "", error: "Failed to create signed URL" }
  }
}

