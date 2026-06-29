'use client'

import { BreadCrumb } from "@/components/breadcrumb";
import CreateTourForm from "@/components/create-tour-form";

export default function CreateTourPage() {
    
    const crumbs = [
        {label: "Tours", link: '/tours'},
    ];

    return (
        <div className="flex flex-col py-6 ml-4 mr-6 gap-6">
            <BreadCrumb crumbs={crumbs} currentPage="Create Tour" />

            <h1 className="font-bold text-xl">Tour Creation Form</h1>

            <CreateTourForm />
        </div>
    );
}