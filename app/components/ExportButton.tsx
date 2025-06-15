// components/ExportButton.tsx
"use client";

import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";

interface ExportButtonProps {
  data: any[];
  fileName?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, fileName = "export" }) => {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

  return (
    <button
      onClick={exportToExcel}
      className="flex items-center gap-2 bg-white rounded-15px p-2 shadow text-gray-500 hover:bg-orange-100 transition duration-200"
      title="ดาวน์โหลด Excel"
    >
      <Download className="text-gray-500 w-5 h-5" /> Download
    </button>
  );
};

export default ExportButton;
