"use client";

import { X } from "lucide-react";
import Modal from "@/components/ui/Modal";

interface EnterpriseContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnterpriseContactModal({
  isOpen,
  onClose,
}: EnterpriseContactModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="mx-4 max-h-full w-full max-w-4xl  overflow-hidden rounded-2xl p-0"
    >
      <div className="flex h-full max-h-full w-full flex-col">
        <div className="shrink-0 border-b border-gray-200 px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 ">
              Contact Enterprise Team
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="Close modal"
            >
              <X className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-7">
          <div className="space-y-5 sm:space-y-6">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 ">
                Enterprise Solutions
              </h3>
              <p className="mt-2 text-xl text-gray-600 ">
                Please fill out the form below and our enterprise team will get back
                to you within 24 hours.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <FormField label="First Name" placeholder="John" />
              <FormField label="Last Name" placeholder="Doe" />
            </div>

            <FormField label="Organisation Name" placeholder="e.g. Acme Education Trust" />
            <FormField label="Work Email" type="email" placeholder="john@organisation.edu" />

            <label className="block">
              <span className="mb-2 block text-lg font-medium text-gray-700 sm:text-xl">
                How can we help?
              </span>
              <textarea
                rows={4}
                placeholder="Tell us about your scale and requirements..."
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-lg text-gray-900 outline-none placeholder:text-gray-400 focus:border-custom-teal sm:rounded-xl sm:px-5 sm:py-4 sm:text-lg"
              />
            </label>
          </div>
        </div>

        <div className="shrink-0 border-t border-gray-200 px-5 py-4 sm:px-7 sm:py-6">
          <div className="flex justify-end gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onClose}
              className="h-11 cursor-pointer rounded-full border border-custom-teal px-5 text-base font-medium text-custom-teal transition-colors hover:bg-custom-teal/5 sm:h-14 sm:px-10 sm:text-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-11 cursor-pointer rounded-full bg-custom-teal px-5 text-base font-semibold text-custom-white transition-colors hover:bg-blue-900 sm:h-14 sm:px-10 sm:text-lg"
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function FormField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: "text" | "email";
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-lg font-medium text-gray-700 ">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-gray-300 px-3 text-lg text-gray-900 outline-none placeholder:text-gray-400 focus:border-custom-teal sm:h-14 sm:rounded-xl sm:px-5 sm:text-lg"
      />
    </label>
  );
}
