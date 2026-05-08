"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        error: {
          style: { background: "#ef4444", color: "#fff" },
        },
      }}
    />
  );
}
