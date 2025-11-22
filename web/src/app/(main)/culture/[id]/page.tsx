export default function CountryPage({ params }: { params: { id: string } }) {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Country: {params.id}</h1>
            <p className="text-muted-foreground">
                Cultural information and native language details for {params.id} will appear here.
            </p>
        </div>
    )
}
