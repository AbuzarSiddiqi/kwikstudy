"use client";

import { useState } from "react";
import { Eye, EyeOff } from "@/components/Icons";

/** Password field with a show/hide toggle. */
export function PasswordInput({
  id,
  name,
  placeholder,
  autoComplete,
  required,
  defaultValue,
}: {
  id: string;
  name: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        className="input !pr-11"
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        defaultValue={defaultValue}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-ink-400 transition-colors hover:bg-paper-deep hover:text-ink-700"
      >
        {show ? <EyeOff width={17} height={17} /> : <Eye width={17} height={17} />}
      </button>
    </div>
  );
}
