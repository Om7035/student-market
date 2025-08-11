import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import type { Review } from "@/lib/types"
import Link from "next/link"

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const formattedDate = new Date(review.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.reviewer?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback>{review.reviewer?.full_name?.charAt(0) || "R"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{review.reviewer?.full_name || "Anonymous"}</h4>
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{review.rating.toFixed(1)}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
            {review.gig_title && (
              <p className="text-sm mt-1">
                For gig:{" "}
                <Link href={`/gigs/${review.gig_id}`} className="text-primary hover:underline">
                  {review.gig_title}
                </Link>
              </p>
            )}
            <p className="mt-2 text-base">{review.comment}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
