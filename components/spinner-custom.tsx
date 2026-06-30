import { LoaderIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export function SpinnerCustom({ progress }: { progress: { destination: string; tour: string; itineraries: string } }) {
  return (
    <div className="flex flex-col justify-start items-start gap-2 w-full">
      <p className="text-lg font-bold mb-4 place-self-center">Creating Tour</p>
      
      <div className="flex justify-between w-full">
        <p className="text-sm font-normal">Destination: </p><div className="flex gap-2 items-center font-semibold text-sm">{progress.destination}{progress.destination !== "Pending" && progress.tour === "Pending" && progress.itineraries === "Pending" && <Spinner />}</div>
      </div>
      <div className="flex justify-between w-full">
        <p className="text-sm font-normal">Tour: </p><div className="flex gap-2 items-center font-semibold text-sm">{progress.tour}{progress.tour !== "Pending" && progress.itineraries === "Pending" && <Spinner />}</div>
      </div>
      <div className="flex justify-between w-full">
        <p className="text-sm font-normal">Itineraries: </p><div className="flex items-center gap-2 font-semibold text-sm">{progress.itineraries}{progress.itineraries !== "Pending" && <Spinner />}</div>
      </div>

    </div>
  )
}
