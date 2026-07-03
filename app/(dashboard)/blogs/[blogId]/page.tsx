import { BreadCrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { PencilIcon } from "lucide-react"
import { getBlog } from "@/lib/helpers/blogs.helpers";

export default async function BlogDetailsPage({ params }: { params: Promise<{ blogId: string }> }) {

    const { blogId } = await params;
    const { success, data, error } = await getBlog(blogId)

    !success && console.log('An error occurred fetching blog', error);
    success && console.log('Successfully fetched blog data', data);

    const crumbs = [
        { label: 'Blogs', link: '/blogs' },
    ]

    return (
        <div className="flex flex-col py-6 ml-4 mr-6 gap-6 h-full">
            <div className="flex justify-between">
                <BreadCrumb crumbs={crumbs} currentPage="Blog Details" />
                <div className="flex items-center gap-4">
                    <Button variant="outline"><PencilIcon size={16} />Edit Blog</Button>
                    <Button variant="destructive">Delete Blog</Button>
                </div>
            </div>
            <div className="min-h-4/5 flex flex-col items-start justify-start">
                <h1 className="font-bold text-xl">{data?.title}</h1>
            </div>
        </div>
    )
}