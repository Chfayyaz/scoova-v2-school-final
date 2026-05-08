import type { ReactNode } from "react";
import Image from "next/image";

interface AuthSplitLayoutProps {
  children: ReactNode;
  className?: string;
  videoSrc?: string;
  tagline?: string;
}

const DEFAULT_AUTH_VIDEO = "/auth/auth-video.mp4";

export default function AuthSplitLayout({
  children,
  className = "",
  videoSrc = DEFAULT_AUTH_VIDEO,
  tagline = "CLARITY. CONFIDENCE. CHOICE.",
}: AuthSplitLayoutProps) {
  return (
    <main className={`min-h-screen bg-gray-100 px-4 py-4 sm:px-8 sm:py-6 lg:px-10 ${className}`}>
      <div className="mx-auto max-w-7xl rounded-lg">
        <Image
          src="/auth/auth-logo.png"
          alt="Scoova"
          width={140}
          height={44}
          priority
          className="h-auto w-28 sm:w-32"
        />

        <div className="mt-6 grid gap-8 lg:mt-14 lg:grid-cols-2 lg:items-center lg:gap-14">
          <section className="mx-auto w-full max-w-md lg:mx-0">{children}</section>

          <aside className="mx-auto w-full max-w-2xl text-center">
            <div className="overflow-hidden rounded-3xl bg-gray-200 shadow-lg">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="aspect-video h-auto w-full object-cover"
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
            </div>
            <p className="mt-5 text-center text-xl font-bold tracking-wide text-gray-900 sm:mt-7  lg:text-2xl">
              {tagline}
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
