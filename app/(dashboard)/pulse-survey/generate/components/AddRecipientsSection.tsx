"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import Button from "@/components/ui/Button";
import CustomSelect from "@/app/(dashboard)/my-school/edit/components/CustomSelect";

export type AddRecipientPayload = {
  name: string;
  email: string;
  role?: string;
};

type AddRecipientsSectionProps = {
  onAddRecipient: (recipient: AddRecipientPayload) => void;
  /** Called when user selects a CSV file. Parent can call API or parse client-side. */
  onUploadCSV: (file: File) => void | Promise<void>;
  showRoleField?: boolean;
  title?: string;
  description?: string;
  wrapInCard?: boolean;
  /** Disable the Add Recipient button (e.g. while API is in progress) */
  addButtonDisabled?: boolean;
  /** Disable the Upload CSV button while request is in progress */
  uploadButtonDisabled?: boolean;
  /** Custom role options when showRoleField is true (e.g. Parent, Staff, Alumni for survey API) */
  roleOptions?: Array<{ value: string; label: string }>;
};

export const CVIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1107_2051)">
      <path d="M0 2.5C0 1.12109 1.12109 0 2.5 0H8.75V5C8.75 5.69141 9.30859 6.25 10 6.25H15V11.875H6.875C5.49609 11.875 4.375 12.9961 4.375 14.375V20H2.5C1.12109 20 0 18.8789 0 17.5V2.5ZM15 5H10V0L15 5ZM7.8125 13.75H8.4375C9.30078 13.75 10 14.4492 10 15.3125V15.625C10 15.9688 9.71875 16.25 9.375 16.25C9.03125 16.25 8.75 15.9688 8.75 15.625V15.3125C8.75 15.1406 8.60938 15 8.4375 15H7.8125C7.64062 15 7.5 15.1406 7.5 15.3125V18.4375C7.5 18.6094 7.64062 18.75 7.8125 18.75H8.4375C8.60938 18.75 8.75 18.6094 8.75 18.4375V18.125C8.75 17.7812 9.03125 17.5 9.375 17.5C9.71875 17.5 10 17.7812 10 18.125V18.4375C10 19.3008 9.30078 20 8.4375 20H7.8125C6.94922 20 6.25 19.3008 6.25 18.4375V15.3125C6.25 14.4492 6.94922 13.75 7.8125 13.75ZM13.0117 13.75H14.375C14.7188 13.75 15 14.0312 15 14.375C15 14.7188 14.7188 15 14.375 15H13.0117C12.7305 15 12.5 15.2305 12.5 15.5117C12.5 15.7148 12.6172 15.8984 12.8047 15.9805L14.2656 16.6289C14.9023 16.9102 15.3125 17.543 15.3125 18.2383C15.3125 19.2109 14.5234 20 13.5508 20H11.875C11.5312 20 11.25 19.7188 11.25 19.375C11.25 19.0312 11.5312 18.75 11.875 18.75H13.5508C13.832 18.75 14.0625 18.5195 14.0625 18.2383C14.0625 18.0352 13.9453 17.8516 13.7578 17.7695L12.2969 17.1211C11.6602 16.8398 11.25 16.207 11.25 15.5117C11.25 14.5391 12.0391 13.75 13.0117 13.75ZM16.875 13.75C17.2188 13.75 17.5 14.0312 17.5 14.375V15.6094C17.5 16.5078 17.7148 17.3906 18.125 18.1875C18.5352 17.3945 18.75 16.5117 18.75 15.6094V14.375C18.75 14.0312 19.0312 13.75 19.375 13.75C19.7188 13.75 20 14.0312 20 14.375V15.6094C20 16.9648 19.5977 18.293 18.8438 19.4219L18.6445 19.7227C18.5273 19.8984 18.332 20 18.125 20C17.918 20 17.7227 19.8945 17.6055 19.7227L17.4062 19.4219C16.6523 18.293 16.25 16.9648 16.25 15.6094V14.375C16.25 14.0312 16.5312 13.75 16.875 13.75Z" fill="#FFDE59"/>
    </g>
    <defs>
      <clipPath id="clip0_1107_2051">
        <path d="M0 0H20V20H0V0Z" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

export const PincilIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.027 9.02344L16.4684 8.58203L15.1442 7.25781L12.7184 4.83203L11.3942 3.50781L10.9528 3.94922L10.07 4.83203L2.28872 12.6133C1.88247 13.0195 1.58559 13.5234 1.42153 14.0742L0.0387177 18.7773C-0.0589386 19.1055 0.0309051 19.4609 0.276999 19.7031C0.523093 19.9453 0.874655 20.0352 1.20278 19.9414L5.902 18.5586C6.45278 18.3945 6.95669 18.0977 7.36294 17.6914L15.1442 9.91016L16.027 9.02344ZM6.24966 15.6016L5.89419 16.4883C5.73794 16.6094 5.56216 16.6992 5.37466 16.7578L2.31997 17.6562L3.21841 14.6055C3.27309 14.4141 3.36684 14.2383 3.48794 14.0859L4.37466 13.7305V14.9805C4.37466 15.3242 4.65591 15.6055 4.99966 15.6055H6.24966V15.6016ZM14.1676 0.730469L13.6051 1.29688L12.7223 2.17969L12.277 2.62109L13.6012 3.94531L16.027 6.37109L17.3512 7.69531L17.7926 7.25391L18.6754 6.37109L19.2418 5.80469C20.2184 4.82813 20.2184 3.24609 19.2418 2.26953L17.7067 0.730469C16.7301 -0.246094 15.1481 -0.246094 14.1715 0.730469H14.1676ZM12.3161 7.29297L6.69106 12.918C6.44887 13.1602 6.05044 13.1602 5.80825 12.918C5.56606 12.6758 5.56606 12.2773 5.80825 12.0352L11.4333 6.41016C11.6754 6.16797 12.0739 6.16797 12.3161 6.41016C12.5582 6.65234 12.5582 7.05078 12.3161 7.29297Z" fill="#44CF7C"/>
  </svg>
);

const DEFAULT_ROLE_OPTIONS = [
  { value: "Parent", label: "Parent" },
  { value: "Student", label: "Student" },
  { value: "Staff", label: "Staff" },
  { value: "Teacher", label: "Teacher" },
];

export default function AddRecipientsSection({
  onAddRecipient,
  onUploadCSV,
  showRoleField = true,
  title,
  description,
  wrapInCard = true,
  addButtonDisabled = false,
  uploadButtonDisabled = false,
  roleOptions = DEFAULT_ROLE_OPTIONS,
}: AddRecipientsSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(roleOptions[0]?.value ?? "Parent");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const newErrors: { name?: string; email?: string } = {};
    if (!name.trim()) newErrors.name = "Full name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) newErrors.email = "Please enter a valid email address.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    const payload: AddRecipientPayload = {
      name: name.trim(),
      email: email.trim(),
    };
    if (showRoleField) payload.role = role;
    onAddRecipient(payload);
    setName("");
    setEmail("");
    setRole(roleOptions[0]?.value ?? "Parent");
  };

  const handleUploadCSVClick = () => {
    fileInputRef.current?.click();
  };

  const handleCSVFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    try {
      await onUploadCSV(file);
    } finally {
      e.target.value = "";
    }
  };

  const grid = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Upload CSV Card */}
      <div className="bg-transparent border border-custom-gray/10 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-custom-yellow/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <CVIcon />
          </div>
          <h3 className="text-sm font-bold text-custom-gray/95 leading-none">
            Upload CSV File
          </h3>
        </div>

        <p className="text-xs text-custom-gray/60 mb-4">Import a bulk list of parents, teachers, and staff.</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          aria-hidden
          onChange={handleCSVFileChange}
        />
        <Button
          type="button"
          variant="filled"
          rounded="full"
          bgColor="bg-custom-teal"
          hoverBgColor="hover:bg-custom-teal/90"
          textColor="text-custom-white"
          onClick={handleUploadCSVClick}
          disabled={uploadButtonDisabled}
          className="w-full  flex items-center mt-22 justify-center gap-2"
        >
          <Upload size={16} />
          <span>{uploadButtonDisabled ? "Uploading..." : "Upload CSV"}</span>
        </Button>
        {uploadedFileName && (
          <p className="text-xs text-custom-gray/95 font-medium mt-2 truncate" title={uploadedFileName}>
            Uploaded: {uploadedFileName}
          </p>
        )}
        <div className="text-xs text-custom-gray/60 mt-2 space-y-0.5">
          <p>Accepted format: CSV</p>
          <p>Expected columns: Name, Email, Role</p>
        </div>
      </div>

      {/* Add Manually Card */}
      <div className="bg-transparent border border-custom-gray/10 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-custom-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <PincilIcon />
          </div>
          <h3 className="text-sm font-bold text-custom-gray/95 leading-none">
            Add Manually
          </h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-custom-gray/95 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="e.g., Jane Doe"
              className={`w-full px-3 py-2 border rounded-lg text-sm text-custom-gray/95 bg-transparent focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal ${errors.name ? "border-red-500" : "border-custom-gray/20"}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-custom-gray/95 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="jane.doe@example.com"
              className={`w-full px-3 py-2 border rounded-lg text-sm text-custom-gray/95 bg-transparent focus:outline-none focus:ring-2 focus:ring-custom-teal/20 focus:border-custom-teal ${errors.email ? "border-red-500" : "border-custom-gray/20"}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          {showRoleField && (
            <div>
              <label className="block text-sm font-medium text-custom-gray/95 mb-1">Select Role</label>
              <CustomSelect
                value={role}
                options={roleOptions}
                onChange={(value) => setRole(String(value))}
                placeholder="Select role"
                className="border-custom-gray/20 bg-custom-white"
              />
            </div>
          )}
          <Button
            type="button"
            variant="filled"
            rounded="full"
            bgColor="bg-custom-teal"
            hoverBgColor="hover:bg-custom-teal/90"
            textColor="text-custom-white"
            onClick={handleAdd}
            disabled={addButtonDisabled}
            className="w-full"
          >
            {addButtonDisabled ? "Adding…" : "Add Recipient"}
          </Button>
        </div>
      </div>
    </div>
  );

  if (!wrapInCard && !title && !description) return grid;
  if (!wrapInCard) {
    return (
      <div>
        {title && <h2 className="text-lg font-bold text-custom-gray/95 mb-2">{title}</h2>}
        {description && <p className="text-sm text-custom-gray/60 mb-6">{description}</p>}
        {grid}
      </div>
    );
  }
  return (
    <div className="bg-transparent">
      {title && <h2 className="text-lg font-bold text-custom-gray/95 mb-2">{title}</h2>}
      {description && <p className="text-sm text-custom-gray/60 mb-6">{description}</p>}
      {grid}
    </div>
  );
}
