import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import { SidebarTrigger } from "./ui/sidebar";

export function BreadCrumb({ crumbs, currentPage }: { crumbs?: { label: string, link: string }[], currentPage: string }) {
    return (
        <Breadcrumb className="flex items-center gap-4">
            <SidebarTrigger />
            <BreadcrumbList>
                {
                    crumbs?.map(({ link, label }) => (
                        <div key={label} className="flex items-center">
                            <BreadcrumbItem>
                                <BreadcrumbLink href={link}>{label}</BreadcrumbLink>
                            </BreadcrumbItem>
                            {crumbs.length && <BreadcrumbSeparator />}
                        </div>
                    ))
                }
                <BreadcrumbItem>
                    <BreadcrumbPage>{currentPage}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}