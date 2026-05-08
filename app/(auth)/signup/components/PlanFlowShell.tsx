"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Undo2 } from "lucide-react";

interface PlanFlowShellProps {
  children: ReactNode;
  onBack?: () => void;
  backHref?: string;
  showTopBar?: boolean;
  showFooter?: boolean;
  contentMaxWidth?: "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
}

const maxWidthMap: Record<NonNullable<PlanFlowShellProps["contentMaxWidth"]>, string> = {
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
};

const FOOTER_LINKS = [
  { id: "privacy", label: "Privacy Policy", href: "#" },
  { id: "terms", label: "Terms", href: "#" },
  { id: "help", label: "Help Center", href: "#" },
];

const SOCIAL_LINKS = [
  { id: "twitter", label: "Twitter", href: "#", Icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 0.5C24.5604 0.5 31.5 7.43959 31.5 16C31.5 24.5604 24.5604 31.5 16 31.5C7.43959 31.5 0.5 24.5604 0.5 16C0.5 7.43959 7.43959 0.5 16 0.5Z" stroke="#D1D5DB"/>
    <path d="M23 26H9V6H23V26Z" stroke="#E5E7EB"/>
    <path d="M23 24H9V10H23V24Z" stroke="#E5E7EB"/>
    <path d="M21.5609 14.1482C21.5698 14.2726 21.5698 14.3969 21.5698 14.5213C21.5698 18.3144 18.6827 22.685 13.4061 22.685C11.7804 22.685 10.2703 22.2142 9 21.3969C9.23097 21.4236 9.45303 21.4325 9.69289 21.4325C11.0342 21.4325 12.269 20.9794 13.2551 20.2066C11.9936 20.1799 10.9365 19.3538 10.5723 18.2167C10.75 18.2434 10.9277 18.2611 11.1142 18.2611C11.3718 18.2611 11.6295 18.2256 11.8693 18.1634C10.5546 17.8969 9.5685 16.7421 9.5685 15.3474V15.3119C9.95047 15.5251 10.3947 15.6584 10.8654 15.6761C10.0926 15.1609 9.58628 14.2814 9.58628 13.2865C9.58628 12.7535 9.72838 12.2649 9.97713 11.8386C11.3896 13.5797 13.5127 14.7167 15.8934 14.8411C15.849 14.6279 15.8223 14.4058 15.8223 14.1837C15.8223 12.6025 17.1015 11.3145 18.6916 11.3145C19.5177 11.3145 20.2639 11.6609 20.788 12.2205C21.4365 12.0962 22.0583 11.8563 22.6091 11.5277C22.3959 12.1939 21.9428 12.7536 21.3477 13.1089C21.9251 13.0467 22.4847 12.8868 22.9999 12.6647C22.6091 13.2332 22.1205 13.7395 21.5609 14.1482Z" fill="#666666"/>
    </svg>
    
     },
  { id: "linkedin", label: "LinkedIn", href: "#", Icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 0.5C24.5604 0.5 31.5 7.43959 31.5 16C31.5 24.5604 24.5604 31.5 16 31.5C7.43959 31.5 0.5 24.5604 0.5 16C0.5 7.43959 7.43959 0.5 16 0.5Z" stroke="#D1D5DB"/>
    <path d="M22 26H10V6H22V26Z" stroke="#E5E7EB"/>
    <g clipPath="url(#clip0_10359_3161)">
    <path d="M21.375 10.875H10.8723C10.391 10.875 10 11.2715 10 11.7582V22.2418C10 22.7285 10.391 23.125 10.8723 23.125H21.375C21.8562 23.125 22.25 22.7285 22.25 22.2418V11.7582C22.25 11.2715 21.8562 10.875 21.375 10.875ZM13.7023 21.375H11.8867V15.5289H13.7051V21.375H13.7023ZM12.7945 14.7305C12.2121 14.7305 11.7418 14.2574 11.7418 13.6777C11.7418 13.098 12.2121 12.625 12.7945 12.625C13.3742 12.625 13.8473 13.098 13.8473 13.6777C13.8473 14.2602 13.377 14.7305 12.7945 14.7305ZM20.5082 21.375H18.6926V18.5312C18.6926 17.8531 18.6789 16.9809 17.7492 16.9809C16.8031 16.9809 16.6582 17.7191 16.6582 18.482V21.375H14.8426V15.5289H16.5844V16.3273H16.609C16.8523 15.868 17.4457 15.384 18.3289 15.384C20.1664 15.384 20.5082 16.5953 20.5082 18.1703V21.375Z" fill="#666666"/>
    </g>
    <defs>
    <clipPath id="clip0_10359_3161">
    <path d="M10 10H22.25V24H10V10Z" fill="white"/>
    </clipPath>
    </defs>
    </svg>
    
     },
  { id: "facebook", label: "Facebook", href: "#", Icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 0.5C24.5604 0.5 31.5 7.43959 31.5 16C31.5 24.5604 24.5604 31.5 16 31.5C7.43959 31.5 0.5 24.5604 0.5 16C0.5 7.43959 7.43959 0.5 16 0.5Z" stroke="#D1D5DB"/>
    <path d="M23 26H9V6H23V26Z" stroke="#E5E7EB"/>
    <g clipPath="url(#clip0_10359_3166)">
    <path d="M22.7812 16C22.7812 12.2539 19.7461 9.21875 16 9.21875C12.2539 9.21875 9.21875 12.2539 9.21875 16C9.21875 19.3846 11.6986 22.1901 14.9404 22.6992V17.9603H13.2178V16H14.9404V14.5059C14.9404 12.8065 15.9521 11.8678 17.5017 11.8678C18.2438 11.8678 19.0198 12.0002 19.0198 12.0002V13.6681H18.1645C17.3223 13.6681 17.0596 14.1909 17.0596 14.7271V16H18.9403L18.6395 17.9603H17.0596V22.6992C20.3014 22.1901 22.7812 19.3846 22.7812 16Z" fill="#666666"/>
    </g>
    <defs>
    <clipPath id="clip0_10359_3166">
    <path d="M9 9H23V23H9V9Z" fill="white"/>
    </clipPath>
    </defs>
    </svg>
    
     },
];

export default function PlanFlowShell({
  children,
  onBack,
  backHref,
  showTopBar = true,
  showFooter = true,
  contentMaxWidth = "4xl",
}: PlanFlowShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {showTopBar && (
        <header className="border-b border-slate-200 bg-custom-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/auth/auth-logo.png"
                alt="Scoova"
                width={130}
                height={36}
                priority
                className="h-8 w-auto sm:h-9"
              />
            </Link>
            <nav className="flex items-center gap-4 text-sm text-gray-600 sm:gap-6">
              <Link href="#" className="underline hover:text-gray-900">
                Support
              </Link>
              <Link href="#" className="underline hover:text-gray-900">
                Need Help?
              </Link>
            </nav>
          </div>
        </header>
      )}

      <main className={`mx-auto w-full flex-1 ${maxWidthMap[contentMaxWidth]} px-4 py-6 sm:px-6 sm:py-8`}>
        {(onBack || backHref) && (
          <div className="mb-5">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 text-sm text-gray-700 transition-colors hover:text-gray-900"
              >
                <Undo2 className="h-4 w-4" />
                Back
              </button>
            ) : (
              <Link
                href={backHref ?? "#"}
                className="inline-flex items-center gap-2 text-sm text-gray-700 transition-colors hover:text-gray-900"
              >
                <Undo2 className="h-4 w-4" />
                Back
              </Link>
            )}
          </div>
        )}

        {children}
      </main>

      {showFooter && (
        <footer className="border-t border-slate-200 bg-custom-white">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-5 text-sm text-gray-600 sm:flex-row sm:justify-between sm:px-6">
            <p>© {new Date().getFullYear()} Scoova. All rights reserved.</p>

            <nav className="flex items-center gap-6">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="transition-colors hover:text-gray-900"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ id, label, href, Icon }) => (
                <Link
                  key={id}
                  href={href}
                  aria-label={label}
                  className=""
                >
                 {Icon}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
