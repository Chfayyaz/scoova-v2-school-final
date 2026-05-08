"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux";
import {
  getMySchoolApi,
  mapMySchoolToHeaderCard,
  mapMySchoolAboutInfo,
  mapManagementTeam,
  type MySchoolData,
} from "@/lib/api/myshool.api";
import SchoolHeroCard from "./components/SchoolHeroCard";
import AboutSection from "./components/AboutSection";
import CampusGallary from "./components/CampusGallary";
import OurLeaderShip from "./components/OurLeaderShip";
import Skeleton from "@/components/ui/Skeleton";

type PageState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: MySchoolData };

function MySchoolPageSkeleton() {
  return (
    <div className="min-h-screen" aria-busy="true" aria-label="Loading school page">
      {/* SchoolHeroCard */}
      <div className="sm:px-6">
        <div className="relative h-72 sm:mt-10 rounded-lg overflow-hidden bg-custom-gray/5">
          <div className="relative sm:absolute sm:top-5 sm:left-10 w-full sm:w-[60%] md:w-[55%] lg:w-[44.50%] sm:p-5 px-3 py-4 rounded-lg shadow-md bg-custom-white/95 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2 flex-1 min-w-0">
                <Skeleton className="h-5 w-[min(100%,14rem)] rounded-md" />
                <Skeleton className="h-3 w-32 rounded-md" />
              </div>
              <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 rounded-full shrink-0" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-2.5 w-full max-w-[4rem] rounded-md" />
                  <Skeleton className="h-3 w-8 rounded-md" />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4 pb-4 sm:pb-0 sm:mt-5">
          <Skeleton className="h-12 w-full sm:w-[11rem] rounded-full" />
        </div>
      </div>

      {/* AboutSection */}
      <div className="grid sm:grid-cols-[60%_40%] mt-3 sm:px-5 gap-6 sm:gap-0">
        <div className="space-y-3">
          <Skeleton className="h-8 w-[min(100%,20rem)] rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-[90%] rounded-md" />
          <Skeleton className="h-4 w-[70%] rounded-md" />
        </div>
        <div className="sm:ml-10 md:ml-25 space-y-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-2 py-3">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2 pt-0.5">
                <Skeleton className="h-3.5 w-24 rounded-md" />
                <Skeleton className="h-4 w-full max-w-[12rem] rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CampusGallary */}
      <div className="mt-5 sm:px-5">
        <Skeleton className="h-7 w-44 rounded-md mb-2.5 md:mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-2.5 md:mt-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-lg" />
          ))}
        </div>
      </div>

      {/* OurLeaderShip */}
      <div className="mt-5 sm:px-5 pb-10">
        <Skeleton className="h-8 w-56 md:h-9 md:w-72 rounded-md mb-2.5 md:mb-4" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mt-2.5 md:mt-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-custom-gray/20 bg-custom-white shadow flex flex-col items-center py-6 px-4"
            >
              <Skeleton className="h-[90px] w-[90px] rounded-full" />
              <Skeleton className="h-5 w-32 rounded-md mt-4" />
              <Skeleton className="h-4 w-28 rounded-md mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MySchoolPage() {
  const schoolIdFromAuth = useAppSelector((s) => s.auth?.user?.school ?? null);
  const [state, setState] = useState<PageState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    getMySchoolApi()
      .then((data) => {
        if (!cancelled) setState({ status: "success", data });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Failed to load school.";
          setState({ status: "error", message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return <MySchoolPageSkeleton />;
  }

  if (state.status === "error") {
    return (
      <div className="min-h-[40vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 text-sm font-medium mb-2">Could not load school</p>
          <p className="text-custom-gray/70 text-sm">{state.message}</p>
        </div>
      </div>
    );
  }

  const { data } = state;
  const editRouteId = schoolIdFromAuth ?? "";
  const headerData = mapMySchoolToHeaderCard(data, { editRouteId: editRouteId || "school" });
  const infoCards = mapMySchoolAboutInfo(data).filter((card) => card.label !== "Website");
  const leaders = mapManagementTeam(data);

  return (
    <div>
      <SchoolHeroCard data={headerData} editSchoolId={schoolIdFromAuth} />
      <AboutSection schoolName={data.name} description={data.bio} infoCards={infoCards} />
      <CampusGallary images={data.gallery ?? []} />
      <OurLeaderShip members={leaders} />
    </div>
  );
}
