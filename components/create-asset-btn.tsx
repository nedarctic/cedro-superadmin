'use client'

import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

export function CreateAssetBtn({ label, path }: { label: string; path: string }) {

    const router = useRouter();

    const handleClick = async () => {
        router.push(path);
    }

    return <Button variant="link" onClick={handleClick}><PlusIcon size={16} />{label}</Button>
}