'use client'

import { SearchIcon } from "lucide-react";
import { Field } from "./ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay = 400) {
    const [debouncedValue, setDebouncedValue] = useState<T>();

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timeout);
    }, [value, delay]);

    return debouncedValue;
}

export function SearchInput({placeholder}: {placeholder: string}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get('search') ?? "");

    const debouncedSearch = useDebounce(search);

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        debouncedSearch?.trim() ? params.set('search', debouncedSearch) : params.delete('search');
        search && params.set('search', search);
        search && params.set('page', '1');
        router.push(`?${params.toString()}`)
    }, [debouncedSearch, router, search]);

    return (
        <Field className="w-full">

            <InputGroup>
                <InputGroupInput
                    value={search}
                    onChange={(e) => setSearch(e.currentTarget.value)}
                    placeholder={placeholder} />
                <InputGroupAddon align="inline-start">
                    <SearchIcon className="text-muted-foreground" />
                </InputGroupAddon>
            </InputGroup>
        </Field>
    );
}