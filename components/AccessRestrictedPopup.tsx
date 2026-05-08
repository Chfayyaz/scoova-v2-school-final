"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import Button from "@/components/ui/Button";

type AccessRestrictedEventDetail = {
  message?: string;
  status?: string;
};

const DEFAULT_MESSAGE =
  "Your school access is currently restricted. Please contact support or your platform administrator.";

function inferStatusFromMessage(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes("suspend")) return "Suspended";
  if (normalized.includes("inactive")) return "Inactive";
  if (normalized.includes("pending")) return "Pending";
  if (normalized.includes("block")) return "Blocked";
  if (normalized.includes("disable")) return "Disabled";
  if (normalized.includes("reject")) return "Rejected";
  if (normalized.includes("restrict")) return "Restricted";
  return "Restricted";
}

export default function AccessRestrictedPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [status, setStatus] = useState("Restricted");

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<AccessRestrictedEventDetail>;
      const resolvedMessage = customEvent.detail?.message?.trim() || DEFAULT_MESSAGE;
      const resolvedStatus = customEvent.detail?.status?.trim() || inferStatusFromMessage(resolvedMessage);
      setMessage(resolvedMessage);
      setStatus(resolvedStatus);
      setIsOpen(true);
    };

    window.addEventListener("access-restricted-popup", handler as EventListener);
    return () => window.removeEventListener("access-restricted-popup", handler as EventListener);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-md rounded-2xl border border-custom-gray/20 bg-custom-white p-5 shadow-2xl">
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-custom-teal/15">
          <ShieldAlert size={22} className="text-custom-teal" />
        </div>

        <h3 className="text-lg font-semibold text-custom-gray/95">Account Access Update</h3>
        <p className="mt-2 text-sm leading-6 text-custom-gray/80">{message}</p>

        <div className="mt-4 rounded-lg border border-custom-teal/20 bg-custom-teal/10 px-3 py-2">
          <p className="text-xs font-medium uppercase tracking-wide text-custom-gray/70">Status</p>
          <p className="mt-1 text-sm font-semibold text-custom-teal">Status: {status}</p>
        </div>

        <div className="mt-5 flex justify-end">
          <Button
            type="button"
            onClick={() => setIsOpen(false)}
            variant="filled"
            bgColor="bg-custom-teal"
            hoverBgColor="hover:opacity-90"
            textColor="text-custom-white"
            className="min-w-28 rounded-lg px-5 py-2"
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}

