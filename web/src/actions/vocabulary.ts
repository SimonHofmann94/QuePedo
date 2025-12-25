'use server'

import { createClient } from "@/utils/supabase/server"
import { userVocabularySchema } from "@/types/schemas"
import { revalidatePath } from "next/cache"

export async function getUserVocabulary() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return []
    }

    const { data, error } = await supabase
        .from('user_vocabulary')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching vocabulary:', error)
        return []
    }

    return data
}

// Backwards compatibility
export const getVocabulary = getUserVocabulary

export async function addVocabulary(formData: unknown, source: 'manual' | 'ai_generated' = 'manual', aiPrompt?: string) {
    const result = userVocabularySchema.safeParse(formData)

    if (!result.success) {
        console.error('Validation error:', result.error)
        return { error: "Invalid data" }
    }

    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "Unauthorized" }
    }

    // Check for duplicates
    const { data: existing } = await supabase
        .from('user_vocabulary')
        .select('id')
        .eq('user_id', user.id)
        .ilike('term', result.data.term)
        .single()

    if (existing) {
        return { error: `The word "${result.data.term}" already exists in your vocabulary.` }
    }

    const { error } = await supabase
        .from('user_vocabulary')
        .insert({
            ...result.data,
            user_id: user.id,
            source,
            ai_prompt: aiPrompt,
        })

    if (error) {
        console.error('Error adding vocabulary:', error)
        return { error: "Failed to add vocabulary" }
    }

    revalidatePath('/vocabulary')
    return { success: true }
}

export async function updateVocabulary(id: string, formData: unknown) {
    const result = userVocabularySchema.partial().safeParse(formData)

    if (!result.success) {
        return { error: "Invalid data" }
    }

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "Unauthorized" }
    }

    const { error } = await supabase
        .from('user_vocabulary')
        .update({
            ...result.data,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating vocabulary:', error)
        return { error: "Failed to update vocabulary" }
    }

    revalidatePath('/vocabulary')
    return { success: true }
}

export async function deleteVocabulary(id: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "Unauthorized" }
    }

    const { error } = await supabase
        .from('user_vocabulary')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting vocabulary:', error)
        return { error: "Failed to delete vocabulary" }
    }

    revalidatePath('/vocabulary')
    return { success: true }
}

export async function deleteMultipleVocabulary(ids: string[]) {
    if (!ids || ids.length === 0) {
        return { error: "No items to delete" }
    }

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "Unauthorized" }
    }

    const { error } = await supabase
        .from('user_vocabulary')
        .delete()
        .in('id', ids)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting vocabulary:', error)
        return { error: "Failed to delete vocabulary" }
    }

    revalidatePath('/vocabulary')
    revalidatePath('/vocabulary/browser')
    return { success: true, deleted: ids.length }
}
