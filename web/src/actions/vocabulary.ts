'use server'

import { createClient } from "@/utils/supabase/server"
import { vocabularySchema } from "@/types/schemas"
import { revalidatePath } from "next/cache"

export async function getVocabulary() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('vocabulary')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching vocabulary:', error)
        return []
    }

    return data
}

export async function addVocabulary(formData: unknown) {
    const result = vocabularySchema.safeParse(formData)

    if (!result.success) {
        return { error: "Invalid data" }
    }

    const supabase = await createClient()
    const { error } = await supabase
        .from('vocabulary')
        .insert(result.data)

    if (error) {
        console.error('Error adding vocabulary:', error)
        return { error: "Failed to add vocabulary" }
    }

    revalidatePath('/vocabulary')
    return { success: true }
}

export async function deleteVocabulary(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('vocabulary')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting vocabulary:', error)
        return { error: "Failed to delete vocabulary" }
    }

    revalidatePath('/vocabulary')
    return { success: true }
}
