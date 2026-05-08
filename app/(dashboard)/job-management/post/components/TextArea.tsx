"use client";

type TextAreaProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  required?: boolean;
  error?: string;
};

export default function TextArea({
  label,
  placeholder,
  value,
  onChange,
  rows = 6,
  required = false,
  error,
}: TextAreaProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-custom-gray/95 mb-2">
        {label}
        {required && <span className="text-custom-purple/80 ml-1">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 rounded-lg border bg-transparent text-custom-gray/95 focus:outline-none focus:border-custom-teal resize-none ${error ? "border-red-500" : "border-custom-gray/10"}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

