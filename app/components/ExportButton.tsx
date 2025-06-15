"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";

interface ExportButtonProps {
  data: any[];
  fileName?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, fileName = "export" }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const exportToExcel = () => {
    setIsDownloading(true);
    setDownloaded(false);

    setTimeout(() => {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, `${fileName}.xlsx`);

      setIsDownloading(false);
      setDownloaded(true);


      setTimeout(() => setDownloaded(false), 2000);
    }, 800); 
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={exportToExcel}
        disabled={isDownloading}
        className={`flex items-center gap-2 bg-white rounded-[15px] p-2 shadow text-gray-500 hover:bg-orange-100 transition duration-200 
          ${isDownloading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
        `}
        title="ดาวน์โหลด Excel"
      >
        <Download className="text-gray-500 w-5 h-5" />
        {downloaded && !isDownloading ? (
          <span className="text-orange-600 font-semibold">Downloaded!</span>
        ) : isDownloading ? (
          "Downloading..."
        ) : (
          "Download"
        )}
      </button>

      {isDownloading && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-200 rounded-b-[15px] overflow-hidden mt-1">
          <div
            className="h-1 bg-orange-500 animate-progress"
            style={{ width: "100%", animationDuration: "0.8s" }}
          ></div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0;
          }
          100% {
            width: 100%;
          }
        }
        .animate-progress {
          animation-name: progress;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};

export default ExportButton;
