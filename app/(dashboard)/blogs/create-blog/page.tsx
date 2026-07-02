import { BreadCrumb } from "@/components/breadcrumb";
import { CreateBlogForm } from "@/components/create-blog-form";

export default function CreateBlogPage() {
    
    const crumbs = [
        {label: "Blogs", link: '/blogs'},
    ];

    return (
        <div className="flex flex-col py-6 ml-4 mr-6 gap-6">
            <BreadCrumb crumbs={crumbs} currentPage="Create Blog" />

            <h1 className="font-bold text-xl">Blog Creation Form</h1>

            <CreateBlogForm />
        </div>
    );
}