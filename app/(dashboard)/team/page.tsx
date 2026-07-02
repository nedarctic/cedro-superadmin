import { BreadCrumb } from "@/components/breadcrumb";
import { SearchInput } from "@/components/search-input";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { getTeam } from "@/lib/helpers/team.helpers";
import { PaginationComponent } from "@/components/pagination";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";

export default async function TeamPage() {

    const { data, success, error } = await getTeam({});

    !success && console.log('An error occurred fetching team', error);
    
    const { meta, team } = data!
    console.log('team', team)

    return (
        <div className="flex flex-col py-6 ml-4 mr-6 gap-6 h-full">
            <div className="flex justify-between">
                <BreadCrumb currentPage="Team" />
                <Link className="flex gap-2 py-1 px-2 border-black text-sm bg-black rounded-md text-white items-center" href="/team/create-member"><PlusIcon size={16} />Add new member</Link>
            </div>
            <SearchInput placeholder="Search members..." />
            <div className="flex flex-col justify-between gap-6 min-h-4/5">
                {team && team.length ?
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {team.map(member => <Card key={member.id}>
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
                            <CardContent>
                                <p className="font-bold text-lg">{member.name}</p>
                                <p className="font-semibold text-md">{member.designation}</p>
                                <p className="text-sm">{member.description}</p>
                            </CardContent>
                        </Card>)}
                    </div> : <p className="text-sm font-medium">No tours at the moment.</p>}
                {team.length ? <PaginationComponent meta={meta} /> : ''}
            </div>
        </div>
    )
}