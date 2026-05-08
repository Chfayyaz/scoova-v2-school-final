"use client";

type TextInputProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
  required?: boolean;
  error?: string;
};

export default function TextInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
  error,
}: TextInputProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-custom-gray/95 mb-2">
        {label}
        {required && <span className="text-custom-purple/80 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-lg border bg-transparent text-custom-gray/95 focus:outline-none focus:border-custom-teal ${error ? "border-red-500" : "border-custom-gray/10"}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

