import { Card, CardContent, CardHeader } from "./ui/card";

export function KPICard({ label, stat }: { label: string, stat: number }) {
    return <Card className="min-w-40">
        <CardHeader className="font-bold">{label}</CardHeader>
        <CardContent className="text-6xl">{stat}</CardContent>
    </Card>
}