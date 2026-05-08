"use client";

import Button from "@/components/ui/Button";
import { DeliveryMethod, Recipient } from "../data";
import { EmailIcon } from "./SendSurveyModal";
import AddRecipientsSection from "../../components/AddRecipientsSection";

export type AddRecipientPayload = {
  name: string;
  email: string;
  role?: string;
};

type DeliveryMethodSectionProps = {
  deliveryMethod: DeliveryMethod;
  recipients: Recipient[];
  onDeliveryMethodChange: (method: Partial<DeliveryMethod>) => void;
  onAddRecipient: (payload: AddRecipientPayload) => void | Promise<void>;
  onUploadCSV: (file: File) => void | Promise<void>;
  deliveryMethodError?: string;
  recipientsError?: string;
  /** When true, show role field (Parent/Staff/Alumni) and disable Add button while API is in progress */
  showRecipientRole?: boolean;
  isAddingRecipient?: boolean;
  /** When true, disable Add Recipient button (e.g. survey not draft) */
  disableAddRecipient?: boolean;
  /** When true, disable Add Recipient button while CSV upload is in progress */
  isUploadingCSV?: boolean;
  /** Role options for Add Manually when integrating with survey recipients API */
  recipientRoleOptions?: Array<{ value: string; label: string }>;
};

const DEFAULT_RECIPIENT_ROLE_OPTIONS = [
  { value: "Parent", label: "Parent" },
  { value: "Staff", label: "Staff" },
  { value: "Alumni", label: "Alumni" },
];

export default function DeliveryMethodSection({
  deliveryMethod,
  recipients,
  onDeliveryMethodChange,
  onAddRecipient,
  onUploadCSV,
  deliveryMethodError,
  recipientsError,
  showRecipientRole = false,
  isAddingRecipient = false,
  disableAddRecipient = false,
  isUploadingCSV = false,
  recipientRoleOptions = DEFAULT_RECIPIENT_ROLE_OPTIONS,
}: DeliveryMethodSectionProps) {
  const handleToggle = (method: "email" | "scoovaInbox") => {
    onDeliveryMethodChange({ [method]: !deliveryMethod[method] });
  };

  return (
    <div className="">
      <h2 className="text-base sm:text-lg md:text-lg lg:text-lg font-bold text-custom-gray/95 mb-3 sm:mb-4 md:mb-4 lg:mb-4">
        Delivery Method
      </h2>

      {/* Toggle Switches in Boxes */}
      <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row gap-3 sm:gap-4 md:gap-4 lg:gap-4 mb-4 sm:mb-5 md:mb-6 lg:mb-6">
        <div className={`flex-1 bg-transparent border rounded-lg p-2.5 sm:p-3 md:p-3 lg:p-3 flex items-center justify-between ${deliveryMethodError ? "border-red-500" : "border-custom-gray/10"}`}>
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2 lg:gap-2">
            <EmailIcon />
            <span className="text-xs sm:text-sm md:text-sm lg:text-sm text-custom-gray/95">Email</span>
          </div>
          <Button
            variant="ghosted"
            rounded="full"
            onClick={() => handleToggle("email")}
            textColor="text-transparent"
            className={`!relative !inline-flex !h-6 !w-11 !items-center !p-0 !m-0 !border-0 !min-w-0 !max-w-none !px-0 !py-0 !font-normal !justify-start ${
              deliveryMethod.email ? "!bg-custom-teal hover:!bg-custom-teal/90" : "!bg-custom-gray/30 hover:!bg-custom-gray/40"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                deliveryMethod.email ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </Button>
        </div>
        <div className={`flex-1 bg-transparent border rounded-lg p-2.5 sm:p-3 md:p-3 lg:p-3 flex items-center justify-between ${deliveryMethodError ? "border-red-500" : "border-custom-gray/10"}`}>
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2 lg:gap-2">
            <EmailIcon />
            <span className="text-xs sm:text-sm md:text-sm lg:text-sm text-custom-gray/95">Scoova Inbox</span>
          </div>
          <Button
            variant="ghosted"
            rounded="full"
            onClick={() => handleToggle("scoovaInbox")}
            textColor="text-transparent"
            className={`!relative !inline-flex !h-6 !w-11 !items-center !p-0 !m-0 !border-0 !min-w-0 !max-w-none !px-0 !py-0 !font-normal !justify-start ${
              deliveryMethod.scoovaInbox ? "!bg-custom-teal hover:!bg-custom-teal/90" : "!bg-custom-gray/30 hover:!bg-custom-gray/40"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                deliveryMethod.scoovaInbox ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </Button>
        </div>
      </div>
      {deliveryMethodError && (
        <p className="text-red-500 text-xs mt-1 mb-4 sm:mb-5 md:mb-6 lg:mb-6">{deliveryMethodError}</p>
      )}

      {/* Recipient Input Cards - shared AddRecipientsSection (Add Manually + API when showRecipientRole) */}
      <div>
      <AddRecipientsSection
        showRoleField={showRecipientRole}
        wrapInCard={false}
        onAddRecipient={(payload) => onAddRecipient({ name: payload.name, email: payload.email, role: payload.role })}
        onUploadCSV={onUploadCSV}
        addButtonDisabled={isAddingRecipient || disableAddRecipient || isUploadingCSV}
        uploadButtonDisabled={isUploadingCSV}
        roleOptions={showRecipientRole ? recipientRoleOptions : undefined}
      />
      {recipientsError && (
        <p className="text-red-500 text-xs mt-1">{recipientsError}</p>
      )}
      </div>
    </div>
  );
}
