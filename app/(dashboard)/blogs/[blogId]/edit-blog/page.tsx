import { BreadCrumb } from "@/components/breadcrumb";
import { EditAssetBtn } from "@/components/edit-asset-btn";
import { UpdateBlogForm } from "@/components/update-blog-form";
import { getBlog } from "@/lib/helpers/blogs.helpers";
import { notFound } from "next/navigation";

export default async function EditBlogPage({ params }: { params: Promise<{ blogId: string }> }) {

    const { blogId } = await params;
    const crumbs = [
        { label: "Blogs", link: "/blogs" },
        { label: "Blog Details", link: `/blogs/${blogId}` }
    ];

    const { success, data, error } = await getBlog(blogId)

    if(!success) return notFound();

    return (
        <div className="flex flex-col py-6 ml-4 mr-6 gap-6 h-full">
            <BreadCrumb crumbs={crumbs} currentPage="Edit Blog" />
            <UpdateBlogForm blog={data!} />
        </div>
    )
}