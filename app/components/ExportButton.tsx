// components/ExportButton.tsx
import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
      style={{
        padding: "10px 20px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      📥 Export เป็น Excel
    </button>
  );
};

export default ExportButton;
