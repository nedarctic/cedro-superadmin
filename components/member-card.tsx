'use client'

import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import { TeamMember } from "@/lib/types/team-member"
import { useRouter } from "next/navigation"
import { UpdateMemberDrawer } from "./update-member-drawer"
import { DeleteMemberBtn } from "./delete-member-btn"

export function MemberCard({ member }: { member: TeamMember }) {
    const router = useRouter();
    return <Card>
        <CardHeader>
            <div className="aspect-square w-full relative">
                <Image
                    src={member.memberImageUrl}
                    unoptimized
                    fill
                    className="rounded-lg object-cover object-top"
                    alt={`${member.designation} picture`}
                />
            </div>
        </CardHeader>
        <CardContent className="flex flex-col justify-between h-full gap-2">
            <div className="flex flex-col">
                <p className="font-bold text-lg">{member.name}</p>
                <p className="font-semibold text-md">{member.designation}</p>
                <p className="text-sm">{member.description}</p>
            </div>
            <div className="flex flex-col gap-1">
                <UpdateMemberDrawer teamMember={member} />
                <DeleteMemberBtn memberId={member.id} />
            </div>
        </CardContent>



    </Card>
}