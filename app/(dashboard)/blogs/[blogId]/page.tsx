import { BreadCrumb } from "@/components/breadcrumb";
import { DeleteBlogBtn } from "@/components/delete-blog-btn";
import { EditAssetBtn } from "@/components/edit-asset-btn";
import { getBlog } from "@/lib/helpers/blogs.helpers";
import Image from "next/image";

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
                    <EditAssetBtn label="Edit Blog" path={`/blogs/${blogId}/edit-blog`} />
                    <DeleteBlogBtn blogId={blogId} />
                </div>
            </div>
            <div className="min-h-4/5 flex flex-col items-start justify-start gap-6">
                <h1 className="font-bold text-xl">{data?.title}</h1>

                <div className="relative aspect-video w-full max-w-7xl">
                    <Image src={data?.blogImageUrl!} alt={"Blog image"} fill unoptimized className="rounded-2xl" />
                </div>

                <div className="flex flex-col gap-4 w-full">

                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg font-extrabold">Introduction</h2>
                        <p className="text-sm">{data?.intro}</p>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <ul className="flex flex-col list-none gap-10">
                            {data?.sections?.map
                                ((section, index) =>
                                    <li key={index} className="flex flex-col gap-2">
                                        <p className="font-semibold text-md underline">{section.subtitle}</p>
                                        <p className="text-sm">{section.content}</p>
                                        {section.sectionImageUrl && <div className="relative aspect-video w-full max-w-7xl">
                                            <Image src={section.sectionImageUrl} alt={`Blog ${section.section} image`} fill className="rounded-xl" unoptimized />
                                        </div>}
                                    </li>
                                )
                            }
                        </ul>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg font-extrabold">Conclusion</h2>
                        <p className="text-sm">{data?.conclusion}</p>
                    </div>
                </div>

            </div>
        </div>
    )
}