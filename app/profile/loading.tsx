import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Profile Info */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-8 w-3/4 rounded" />
            <Skeleton className="h-5 w-1/2 rounded" />
            <Skeleton className="h-5 w-2/3 rounded" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-6 w-1/3 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-6 w-1/4 rounded" />
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-full" />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-6 w-1/3 rounded" />
            <Skeleton className="h-8 w-full rounded" />
          </div>
        </div>

        {/* Right Column - Gigs & Reviews */}
        <div className="w-full md:w-2/3 space-y-6">
          <div className="flex space-x-4">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>

          {/* Gigs/Reviews List */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
