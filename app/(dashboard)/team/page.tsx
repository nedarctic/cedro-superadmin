import { BreadCrumb } from "@/components/breadcrumb";
import { SearchInput } from "@/components/search-input";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { getTeam } from "@/lib/helpers/team.helpers";
import { PaginationComponent } from "@/components/pagination";
import { MemberCard } from "@/components/member-card";
import { CreateAssetBtn } from "@/components/create-asset-btn";

export default async function TeamPage({ searchParams }: {
    searchParams: Promise<{
        page: string;
        limit: string;
        search: string;
    }>
}) {

    const { limit, page, search } = await searchParams;

    const { data, success, error } = await getTeam({ limit, page, search });

    !success && console.log('An error occurred fetching team', error);

    const { meta, team } = data!

    return (
        <div className="flex flex-col py-6 ml-4 mr-6 gap-6 h-full">
            <div className="flex justify-between">
                <BreadCrumb currentPage="Team" />
                <CreateAssetBtn path={"/team/create-member"} label={"Create Member"}/>
            </div>
            <SearchInput placeholder="Search members..." />
            <div className="flex flex-col justify-between gap-6 min-h-4/5">
                {team && team.length ?
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {team.map(member => <MemberCard key={member.id} member={member} />)}
                    </div> : <p className="text-sm font-medium">No member at the moment.</p>}
                {team.length ? <PaginationComponent meta={meta} /> : ''}
            </div>
        </div>
    )
}