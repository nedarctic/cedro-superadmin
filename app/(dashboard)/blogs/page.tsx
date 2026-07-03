import { BreadCrumb } from "@/components/breadcrumb";
import { PaginationComponent } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { TableData } from "@/components/table-data";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { getBlogs } from "@/lib/helpers/blogs.helpers";

export default async function BlogsPage() {

    const { success, data, error } = await getBlogs({});

    !success && console.log('An error occurred', error);

    const {blogs, meta} = data!;

    const headers = [
        {label: 'Title', key: 'title'},
        {label: 'Date', key: 'createdAt'}
    ];

    return (
        <div className="flex flex-col py-6 ml-4 mr-6 gap-6 h-full">
            <div className="flex justify-between">
                <BreadCrumb currentPage="Blogs" />
                <Link className="flex gap-2 py-1 px-2 border-black text-sm bg-black rounded-md text-white items-center" href="/blogs/create-blog"><PlusIcon size={16} />Create new blog</Link>
            </div>
            <SearchInput placeholder="Search blogs..." />
            <div className="flex flex-col justify-between min-h-4/5">
                {blogs.length ? <TableData path="/blogs" headers={headers} data={blogs} /> : <p className="text-sm font-medium">No tours at the moment.</p>}
                {blogs.length ? <PaginationComponent meta={meta} /> : ''}
            </div>
        </div>
    )
}