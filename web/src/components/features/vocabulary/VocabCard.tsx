'use client'

import { UserVocabulary } from "@/types/schemas"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteVocabulary } from "@/actions/vocabulary"
import { useState } from "react"

interface VocabCardProps {
    item: UserVocabulary
}

// Helper to get the first available translation
function getDisplayTranslation(translations: Record<string, string>): string {
    if (!translations || typeof translations !== 'object') return '';
    if (translations.de) return translations.de;
    if (translations.en) return translations.en;
    const keys = Object.keys(translations);
    return keys.length > 0 ? translations[keys[0]] : '';
}

export function VocabCard({ item }: VocabCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        await deleteVocabulary(item.id)
        setIsDeleting(false)
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">{item.term}</CardTitle>
                <Badge variant={item.difficulty_rating > 3 ? "destructive" : "secondary"}>
                    Lvl {item.difficulty_rating}
                </Badge>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{getDisplayTranslation(item.translations)}</p>
                {item.context_sentence && (
                    <p className="mt-2 text-xs italic">"{item.context_sentence}"</p>
                )}
                <div className="mt-4 flex justify-end">
                    <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isDeleting}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
