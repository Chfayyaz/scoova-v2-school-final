"use client";

import Button from "@/components/ui/Button";
import { ReviewItem } from "../data";
import { StarRating } from "./StarRating";

type ReviewsListProps = {
  reviews: ReviewItem[];
};


export const ReviewItemIcon=()=>(
  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.66667 6.22634L0 4.66634L8 -0.000326157L16 4.66634V10.333H14.6667V5.43967L13.3333 6.22634V10.6797L13.1867 10.853C12.5644 11.6263 11.8089 12.2308 10.92 12.6663C10.0044 13.1108 9.03111 13.333 8 13.333C6.96889 13.333 5.99556 13.1108 5.08 12.6663C4.19111 12.2308 3.43556 11.6263 2.81333 10.853L2.66667 10.6797V6.22634ZM4 6.99967V10.1997C4.49778 10.7597 5.08889 11.1952 5.77333 11.5063C6.47556 11.8352 7.21778 11.9997 8 11.9997C8.78222 11.9997 9.52444 11.8352 10.2267 11.5063C10.9111 11.1952 11.5022 10.7597 12 10.1997V6.99967L8 9.33301L4 6.99967ZM2.64 4.66634L8 7.78634L13.36 4.66634L8 1.54634L2.64 4.66634Z" fill="#1BC1BC"/>
</svg>

)

export default function ReviewsList({ reviews }: ReviewsListProps) {
  return (
    <div className="shadow-[0_2px_8px_rgba(0,0,0,0.06)] rounded-lg bg-custom-white px-4 py-4">
      <div className="sm:flex justify-between items-center mb-4">
        <h2 className="text-[18px] font-semibold text-custom-gray/95">
          Recent Reviews
        </h2>
        <Button
          href="/reviews"
          rounded="full"
          variant="outlined"
          textColor="custom-gray"
          borderColor="custom-gray"
          hoverBgColor="" // remove hover
          hoverTextColor="" // remove hover
          className="cursor-pointer text-xs w-full mt-2 sm:w-auto sm:mt-0"
        >
          View All Reviews
        </Button>
      </div>

      <div className="space-y-12 px-8">
        {reviews.map((review) => (
          <div key={review.id}>
            <div className="flex items-center gap-3">
              <div
                className="rounded-full h-10 w-10 flex items-center justify-center p-2 shrink-0 bg-[#D1F3F2]"
                aria-hidden
              >
                <ReviewItemIcon />
              </div>
              <div>
                <p className="bg-custom-gray/10 inline-block rounded-full px-2 text-sm">
                  {review.author}
                </p>
                <div className="flex items-center gap-2">
                  <span>
                    <StarRating rating={review.rating} />
                  </span>
                  <span className="text-sm text-custom-gray/70">{review.time}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="font-semibold text-[16px] mt-2 text-custom-gray/95">
                {review.title}
              </p>
              <p className="text-custom-gray/70 text-sm mt-4 border-b border-custom-gray/10 pb-4">
                {review.description}
              </p>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
