"use client";

import type { ReactNode } from "react";

type SkeletonProps = {
  className?: string;
};

export default function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`skeleton-shimmer ${className}`} aria-hidden="true" />;
}

export function AuthScreenSkeleton() {
  return (
    <div className="h-screen w-full overflow-hidden flex flex-col md:flex-row">
      <div className="w-full md:w-[47%] lg:w-[45%] flex-shrink-0 h-full bg-custom-white px-4 md:px-6 lg:px-8 xl:px-12 pt-6">
        <div className="max-w-[540px] w-full">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <div className="mt-14 space-y-4">
            <Skeleton className="h-10 w-44 rounded-lg" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>
          <div className="mt-8 space-y-5">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
      <div className="hidden md:block md:w-[53%] lg:w-[55%] h-full bg-custom-gray-light/60 p-8">
        <Skeleton className="h-full w-full rounded-2xl" />
      </div>
    </div>
  );
}

export function SectionSkeleton({ children }: { children?: ReactNode }) {
  return (
    <div className="w-full border-t border-custom-gray/10 pt-6 mt-6 bg-custom-gray-light/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        {children ?? (
          <>
            <Skeleton className="h-7 w-52 rounded-lg" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </>
        )}
      </div>
    </div>
  );
}

