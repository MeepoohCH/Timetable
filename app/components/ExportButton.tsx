"use client";

import React, { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";

interface ExportButtonProps {
  data: any[];
  fileName?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, fileName = "export" }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const exportToExcel = async () => {
    setIsDownloading(true);
    setDownloaded(false);

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");

      if (data.length > 0) {
        // สร้าง header จาก keys ของ object แถวแรก
        const columns = Object.keys(data[0]).map((key) => ({ header: key, key }));
        worksheet.columns = columns;

        // เติมข้อมูลแถว
        data.forEach((item) => {
          worksheet.addRow(item);
        });
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, `${fileName}.xlsx`);

      setDownloaded(true);
    } catch (error) {
      console.error("Export Excel failed:", error);
    } finally {
      setIsDownloading(false);
      setTimeout(() => setDownloaded(false), 2000);
    }
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
