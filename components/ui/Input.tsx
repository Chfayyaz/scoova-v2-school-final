"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, rightIcon, containerClassName = "", className = "", type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={containerClassName}>
        {label && (
          <label className="block text-sm font-semibold text-[#4B5563] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`w-full py-3.5 px-4 bg-white border border-[#E5E7EB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] outline-none focus:border-[#3F5893] focus:ring-1 focus:ring-[#3F5893] transition-all ${
              isPassword || rightIcon ? "pr-12" : ""
            } ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""} ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 flex items-center justify-center text-[#9CA3AF] hover:text-[#3F5893] transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
          {rightIcon && !isPassword && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#9CA3AF]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, containerClassName = "", className = "", ...props }, ref) => {
    return (
      <div className={containerClassName}>
        {label && (
          <label className="block text-sm font-semibold text-[#4B5563] mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full py-3.5 px-4 bg-white border border-[#E5E7EB] rounded-md text-sm text-[#1F2937] placeholder:text-[#9CA3AF] outline-none focus:border-[#3F5893] focus:ring-1 focus:ring-[#3F5893] transition-all resize-none ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Input;
