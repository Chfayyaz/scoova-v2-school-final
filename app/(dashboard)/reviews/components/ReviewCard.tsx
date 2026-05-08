"use client";

import { useState } from "react";
import { Review } from "../data";
import { ArrowUp, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import { createReviewReplyApi, type ApiReviewReply } from "@/lib/api/review.api";
import toast from "react-hot-toast";

type ReviewCardProps = {
  review: Review;
  /** Called after a reply is created so the parent can refetch the review list (e.g. tabs / pagination). */
  onReplySuccess?: () => void;
};

function formatReplyTime(createdAt?: string, timeAgo?: string): string {
  if (timeAgo) return timeAgo;
  if (!createdAt) return "";
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 1) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }
  const years = Math.floor(diffDays / 365);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

export default function ReviewCard({ review, onReplySuccess }: ReviewCardProps) {
  const initialReplies = Array.isArray(review.replies)
    ? (review.replies as ApiReviewReply[])
    : [];
  const [replyText, setReplyText] = useState(review.replyText || "");
  const [replies, setReplies] = useState<ApiReviewReply[]>(initialReplies);
  const [sendingReply, setSendingReply] = useState(false);

  const handleReplySubmit = async () => {
    const trimmed = replyText.trim();
    if (!trimmed) {
      toast.error("Please enter a reply.");
      return;
    }
    if (sendingReply) return;
    setSendingReply(true);
    try {
      const data = await createReviewReplyApi(String(review.id), trimmed);
      setReplyText("");
      if (data?.replies) setReplies(data.replies);
      onReplySuccess?.();
      toast.success("Reply sent successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send reply.";
      const alreadyReplied = message.toLowerCase().includes("reply already exists");
      if (alreadyReplied) {
        toast.error(message);
        onReplySuccess?.();
      } else {
        toast.error(message, { id: "reply-error" });
      }
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <div className="bg-custom-white relative rounded-lg shadow-sm py-4 px-4 sm:py-6 sm:px-5 lg:py-15 lg:px-6 mb-4">
      {/* Reviewer Info */}
      <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-custom-teal flex items-center justify-center flex-shrink-0">
          <Users size={16} className="sm:w-[18px] sm:h-[18px] text-custom-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="mb-1">
            <span className="bg-custom-gray/10 text-custom-gray/95 font-medium text-xs px-2 sm:px-3 py-1 rounded-full inline-block">
              {review.reviewerRole}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-custom-teal font-bold text-xs sm:text-sm">
              {review.rating}/10
            </span>
            <span className="text-custom-gray/60 text-xs sm:text-sm">
              {review.timeAgo}
            </span>
          </div>
        </div>
      </div>

      {/* Review Text */}
      <p className="text-[#A2A2A2] mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
        {review.reviewText}
      </p>

      {/* Fetched replies */}
      {replies.length > 0 ? (
        <div className="mb-3 sm:mb-4 space-y-2">
          <p className="text-custom-teal font-semibold text-xs sm:text-sm mb-2">
            Replies
          </p>
          {replies.map((r, i) => (
            <div
              key={r.id ?? i}
              className="bg-custom-gray/5 rounded-lg p-3 text-sm text-custom-gray/80"
            >
              <p className="mb-1">{r.replyText ?? r.text ?? r.body ?? ""}</p>
              {(r.timeAgo || r.createdAt) && (
                <span className="text-[#A2A2A2] text-xs">
                  {formatReplyTime(r.createdAt, r.timeAgo)}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : null}

      {/* Reply Section – only show when no reply exists yet (one reply per review) */}
      {replies.length > 0 ? (
        <p className="text-[#A2A2A2] text-sm italic">You have already replied to this review.</p>
      ) : (
        <>
          <div className="bg-custom-white shadow-sm rounded-lg p-3 sm:p-4">
            <label className="block text-custom-teal font-semibold text-xs sm:text-sm mb-2">
              Your Reply
            </label>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type Here..."
              className="w-full bg-custom-white border-0 rounded-lg px-0 py-0 text-custom-gray/40 text-xs sm:text-sm outline-none resize-none lg:pr-24"
              rows={3}
            />
          </div>

          <div className="mt-3 flex justify-end lg:absolute lg:bottom-3 lg:right-6 lg:mt-0">
            <Button
              type="button"
              onClick={handleReplySubmit}
              disabled={sendingReply}
              rounded="full"
              bgColor="bg-custom-teal"
              hoverBgColor="hover:bg-custom-teal/90"
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
            >
              <ArrowUp size={14} className="sm:w-4 sm:h-4" />
              {sendingReply ? "Sending…" : "Reply"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

