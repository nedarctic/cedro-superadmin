'use client'

import { PencilIcon } from "lucide-react";
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

export function EditAssetBtn ({label, path}: {label: string; path: string}) {
    
    const router = useRouter();
    return <Button onClick={() => router.push(path)}><PencilIcon size={16} />{label}</Button>
}