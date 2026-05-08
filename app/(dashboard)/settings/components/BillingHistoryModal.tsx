"use client";

import { X, FileText } from "lucide-react";
import Button from "@/components/ui/Button";

export type BillingEntry = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "paid" | "pending" | "failed";
};

const mockBillingHistory: BillingEntry[] = [
  {
    id: "1",
    date: "2024-03-01",
    description: "Premium School Plan - Monthly",
    amount: 29.99,
    status: "paid",
  },
  {
    id: "2",
    date: "2024-02-01",
    description: "Premium School Plan - Monthly",
    amount: 29.99,
    status: "paid",
  },
  {
    id: "3",
    date: "2024-01-01",
    description: "Premium School Plan - Monthly",
    amount: 29.99,
    status: "paid",
  },
  {
    id: "4",
    date: "2023-12-01",
    description: "Premium School Plan - Monthly",
    amount: 29.99,
    status: "paid",
  },
];

type BillingHistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  entries?: BillingEntry[];
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusStyles(status: BillingEntry["status"]) {
  switch (status) {
    case "paid":
      return "bg-custom-green/20 text-[#15803D]";
    case "pending":
      return "bg-custom-yellow/20 text-amber-700";
    case "failed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-custom-gray/10 text-custom-gray/80";
  }
}

export default function BillingHistoryModal({
  isOpen,
  onClose,
  entries = mockBillingHistory,
}: BillingHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-custom-white rounded-lg shadow-xl w-full max-w-[600px] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-custom-gray/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-custom-teal/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-custom-teal" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-semibold text-custom-gray/95">
                Billing History
              </h2>
              <p className="text-xs text-custom-gray/80">
                View and download past invoices
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghosted"
            rounded="full"
            hoverBgColor="hover:bg-custom-gray/10"
            className="p-1.5 w-auto h-auto"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-custom-gray/60" />
          </Button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <ul className="space-y-3">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3 px-4 border border-custom-gray/10 rounded-lg hover:border-custom-gray/20 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-custom-gray/95 truncate">
                    {entry.description}
                  </p>
                  <p className="text-xs text-custom-gray/60 mt-0.5">
                    {formatDate(entry.date)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-semibold text-custom-gray/95">
                    ${entry.amount.toFixed(2)}
                  </span>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyles(
                      entry.status
                    )}`}
                  >
                    {entry.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-custom-gray/10">
          <Button
            onClick={onClose}
            variant="filled"
            rounded="full"
            className="w-full"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
