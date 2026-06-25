import { SiteHeader } from "@/components/site-header"


export default function Page() {
  return (
    <div>
      <SiteHeader />
      <div className="flex flex-col items-center justify-center min-h-screen w-full">
        <p className="font-medium">Hello world!</p>
      </div>
    </div>
  )
}
