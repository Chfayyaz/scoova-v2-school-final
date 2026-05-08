"use client";

import { useRef } from "react";
import { FileText, Upload } from "lucide-react";
import Button from "@/components/ui/Button";

type FileAttachmentProps = {
  fileName?: string;
  fileType?: string;
  onReplace: (file: File) => void;
  onDelete: () => void | Promise<void>;
  onFileSelect?: (file: File) => void;
  disabled?: boolean;
};

/** Map MIME type to short display label */
function getFileTypeLabel(mimeType: string | undefined): string {
  if (!mimeType) return "PDF";
  const lower = mimeType.toLowerCase();
  if (lower.includes("pdf")) return "PDF";
  if (lower.includes("msword") && !lower.includes("openxml")) return "DOC";
  if (lower.includes("wordprocessingml") || lower.includes("docx")) return "DOCX";
  return "FILE";
}

export const CrossIcon = () => (
  <svg width="12" height="12" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    <path d="M0.75 7.82L7.822 0.75M0.75 0.75L7.822 7.82" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export const ReplaceIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M12 2.5C10.9389 2.49975 9.9004 2.80645 9.00969 3.3831C8.11897 3.95976 7.41408 4.78176 6.98 5.75C6.91934 5.88727 6.85734 6.02394 6.794 6.16L6.726 6.292C6.69295 6.34632 6.64985 6.39383 6.599 6.432C6.54324 6.46261 6.48214 6.48229 6.419 6.49C6.383 6.497 6.309 6.5 6 6.5C5.07174 6.5 4.1815 6.86875 3.52513 7.52513C2.86875 8.1815 2.5 9.07174 2.5 10C2.5 10.9283 2.86875 11.8185 3.52513 12.4749C4.1815 13.1313 5.07174 13.5 6 13.5H6.672L7.672 12.5H6C5.33696 12.5 4.70107 12.2366 4.23223 11.7678C3.76339 11.2989 3.5 10.663 3.5 10C3.5 9.33696 3.76339 8.70107 4.23223 8.23223C4.70107 7.76339 5.33696 7.5 6 7.5H6.054C6.28 7.5 6.467 7.5 6.616 7.47C6.796 7.434 6.974 7.38 7.142 7.27C7.31 7.162 7.432 7.022 7.54 6.872C7.598 6.792 7.65 6.688 7.697 6.589C7.74633 6.483 7.81067 6.34167 7.89 6.165L7.892 6.16C8.24694 5.3673 8.82364 4.69422 9.55256 4.22195C10.2815 3.74968 11.1315 3.49839 12 3.49839C12.8685 3.49839 13.7185 3.74968 14.4474 4.22195C15.1764 4.69422 15.7531 5.3673 16.108 6.16L16.11 6.166C16.1893 6.342 16.2537 6.483 16.303 6.589C16.35 6.688 16.402 6.791 16.46 6.872C16.567 7.022 16.69 7.162 16.858 7.271C17.026 7.38 17.204 7.434 17.384 7.471C17.533 7.501 17.72 7.501 17.946 7.5H18C18.663 7.5 19.2989 7.76339 19.7678 8.23223C20.2366 8.70107 20.5 9.33696 20.5 10C20.5 10.663 20.2366 11.2989 19.7678 11.7678C19.2989 12.2366 18.663 12.5 18 12.5H16.328L17.328 13.5H18C18.4596 13.5 18.9148 13.4095 19.3394 13.2336C19.764 13.0577 20.1499 12.7999 20.4749 12.4749C20.7999 12.1499 21.0577 11.764 21.2336 11.3394C21.4095 10.9148 21.5 10.4596 21.5 10C21.5 9.54037 21.4095 9.08525 21.2336 8.66061C21.0577 8.23597 20.7999 7.85013 20.4749 7.52513C20.1499 7.20012 19.764 6.94231 19.3394 6.76642C18.9148 6.59053 18.4596 6.5 18 6.5C17.691 6.5 17.617 6.497 17.582 6.49C17.5188 6.48198 17.4577 6.46196 17.402 6.431C17.3508 6.39293 17.3073 6.34541 17.274 6.291L17.258 6.264L17.206 6.159C17.1427 6.02328 17.0807 5.88694 17.02 5.75C16.5859 4.78176 15.881 3.95976 14.9903 3.3831C14.0996 2.80645 13.0611 2.49975 12 2.5Z" fill="#168941"/>
<path d="M12 12L11.646 11.646L12 11.293L12.354 11.646L12 12ZM12.5 21C12.5 21.1326 12.4473 21.2598 12.3535 21.3536C12.2598 21.4473 12.1326 21.5 12 21.5C11.8674 21.5 11.7402 21.4473 11.6464 21.3536C11.5527 21.2598 11.5 21.1326 11.5 21H12.5ZM7.646 15.646L11.646 11.646L12.354 12.354L8.354 16.354L7.646 15.646ZM12.354 11.646L16.354 15.646L15.646 16.354L11.646 12.354L12.354 11.646ZM12.5 12V21H11.5V12H12.5Z" fill="#168941"/>
</svg>

)

export default function FileAttachment({
  fileName,
  fileType,
  onReplace,
  onDelete,
  onFileSelect,
  disabled = false,
}: FileAttachmentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (fileName && onReplace) {
        onReplace(file);
      } else if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleReplace = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  if (!fileName) {
    return (
      <div className="mb-6 inline-block bg-custom-white rounded-lg border border-custom-gray/10 shadow-sm p-6">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div
          onClick={handleClick}
          className="border-2 border-dashed border-custom-gray/20 rounded-lg p-8 text-center cursor-pointer hover:border-custom-teal/50 transition-colors"
        >
          <Upload className="mx-auto mb-2 text-custom-gray/60" size={24} />
          <p className="text-sm text-custom-gray/60">Click to attach file</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mb-6 inline-block rounded-lg border border-custom-gray/10 shadow-sm p-5 max-w-full">
      <Button
        type="button"
        variant="ghosted"
        rounded="full"
        bgColor="bg-white"
        hoverBgColor="none"
        textColor="text-current"
        disabled={disabled}
        className="absolute top-2 right-2 w-6 h-6 
        min-w-6 min-h-6 p-0 flex items-center justify-center
         z-10 outline-none " 
        onClick={(e) => {
          e.stopPropagation();
          void onDelete();
        }}
        aria-label="Remove file"
      >
        <CrossIcon />
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />
      <div className="inline-block max-w-full min-w-0">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 border-2 border-custom-purple/60 rounded-lg flex flex-col items-center justify-center bg-custom-white">
              <FileText size={32} className="text-custom-purple/80 mb-1 flex-shrink-0" />
              <span className="text-xs font-medium text-custom-purple/80 truncate max-w-full px-1">
                {getFileTypeLabel(fileType)}
              </span>
            </div>
          </div>
          <Button
            onClick={handleReplace}
            variant="ghosted"
            hoverBgColor="none"
            textColor="text-custom-green"
            hoverTextColor="hover:text-custom-green/80"
            className="flex flex-col items-center   text-xs font-medium whitespace-nowrap pt-16 h-auto flex-shrink-0"
          >
            <ReplaceIcon />
            Replace
          </Button>
        </div>
        {fileName && (
          <p className="text-xs text-custom-gray/95 mt-2 max-w-[140px] truncate" title={fileName}>
            {fileName}
          </p>
        )}
      </div>
    </div>
  );
}

