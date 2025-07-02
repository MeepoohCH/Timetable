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
        // สร้าง header 2 แถว

        // แถว 1
        worksheet.mergeCells("A1:K1");
        worksheet.getCell("A1").value = "หลักสูตรวิศวกรรมระบบไอโอทีและสารสนเทศ ภาควิชาวิศวกรรมระบบไอโอทีและสารสนเทศ คณะวิศวกรรมศาสตร์";

        worksheet.mergeCells("A2:A3");
        worksheet.getCell("A2").value = "รหัสวิชา";
        worksheet.mergeCells("B2:B3");
        worksheet.getCell("B2").value = "ชื่อวิชา";
        worksheet.mergeCells("C2:C3");
        worksheet.getCell("C2").value = "ท/ป";
        worksheet.mergeCells("D2:D3");
        worksheet.getCell("D2").value = "ชั้นปี/กลุ่ม";
        worksheet.mergeCells("E2:F2");
        worksheet.getCell("E2").value = "วัน/เวลาสอน";
        worksheet.mergeCells("G2:H2");
        worksheet.getCell("G2").value = "ตารางสอนชดเชย";
        worksheet.mergeCells("I2:I3");
        worksheet.getCell("I2").value = "วันหยุด";
        worksheet.mergeCells("J2:J3");
        worksheet.getCell("J2").value = "อาจารย์ผู้สอน";
        worksheet.mergeCells("K2:K3");
        worksheet.getCell("K2").value = "หมายเหตุ";

        // แถว 3
        worksheet.getCell("E3").value = "วัน/เดือน/ปี";
        worksheet.getCell("F3").value = "เวลา";
        worksheet.getCell("G3").value = "วัน/เดือน/ปี";
        worksheet.getCell("H3").value = "เวลา";

        worksheet.columns = [
          { key: "subject_id", width: 15 },
          { key: "subjectName", width: 30 },
          { key: "subjectType", width: 8 },
          { key: "yearLevelSec", width: 15 },
          { key: "teachDate", width: 15 },
          { key: "teachTime", width: 15 },
          { key: "makeupDate", width: 15 },
          { key: "makeupTime", width: 15 },
          { key: "holiday", width: 15 },
          { key: "teachers", width: 30 },
          { key: "remark", width: 20 },
        ];

        data.forEach((item) => {
            if (!item.remark) {
              item.remark = ""
            }
            worksheet.addRow(item);
        });

        const startRow = 4;
        let mergeStartRow = startRow;
        let currentValue = worksheet.getCell(`E${startRow}`).value;

        for (let i = startRow + 1; i < startRow + data.length; i++) {
        const thisValue = worksheet.getCell(`E${i}`).value;

        if (thisValue === currentValue) {
          continue;
        } else {
          if (i - 1 > mergeStartRow) {
            // Merge คอลัมน์ I ของช่วงที่ค่า E ซ้ำกัน
            worksheet.mergeCells(`I${mergeStartRow}:I${i - 1}`);
          }
          // reset
          currentValue = thisValue;
          mergeStartRow = i;
        }
      }

      // merge ช่วงสุดท้าย (ถ้ามี)
      const lastRow = startRow + data.length - 1;
      if (lastRow > mergeStartRow) {
        worksheet.mergeCells(`I${mergeStartRow}:I${lastRow}`);
      }



        worksheet.eachRow((row) => {
          row.eachCell((cell) => {
            const wrapText = typeof cell.value === "string" && cell.value.includes("\n");
            cell.alignment = { horizontal: "center", vertical: "middle", wrapText };
            cell.font = { name: "THSarabunPSK", size: 16 };
            worksheet.getCell("A1").font = {name: "THSarabunPSK", size: 16, bold: true };
            cell.border = {
              top: { style: "medium", color: { argb: "FF000000" } },
              left: { style: "medium", color: { argb: "FF000000" } },
              bottom: { style: "medium", color: { argb: "FF000000" } },
              right: { style: "medium", color: { argb: "FF000000" } },
            };
          });
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
