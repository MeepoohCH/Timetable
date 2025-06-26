// components/CustomDateInput.tsx
"use client";

import { forwardRef } from "react";

type Props = {
  value?: string;
  onClick?: () => void;
};

const CustomDateInput = forwardRef<HTMLInputElement, Props>(({ value, onClick }, ref) => {
  return (
    <input
      className="boxT border border-gray-300 rounded-[10px] px-2 py-1 text-sm w-40"
      style={{ height: "29px" }}
      onClick={onClick}
      ref={ref}
      value={value}
      placeholder="เลือกวันที่"
      readOnly
    />
  );
});

CustomDateInput.displayName = "CustomDateInput";
export default CustomDateInput;
