import { useState, useRef, useEffect } from "react";

export default function DropdownTeacher({
  label,
  items,
  selected,
  setSelected,
}: {
  label: string;
  items: { id: number | string; label: string }[];
  selected: number | string | null;
  setSelected: (val: number | string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // กรอง items ตาม searchText (ไม่สนใจตัวพิมพ์ใหญ่/เล็ก)
  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-xs sm:max-w-[190px]" ref={ref}>
      <label className="text-sm"> {label} </label>
      <button
        className="flex items-center justify-between border border-gray-300 rounded-[10px] w-48 bg-white text-sm px-2 py-1"
        onClick={() => setOpen((o) => !o)}
      >
        <span className={`truncate ${selected ? "text-black" : "text-gray-400"}`}>
          {selected ? items.find((i) => i.id === selected)?.label : "เลือก..."}
        </span>
        <svg className="ml-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border text-sm rounded shadow max-h-60 overflow-auto">
          {/* input สำหรับพิมพ์ค้นหา */}
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="ค้นหา..."
            className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none"
            autoFocus
          />

          {/* แสดงรายการที่กรองแล้ว */}
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className={`cursor-pointer px-4 py-2 hover:bg-[#F96D00] hover:text-white ${
                  selected === item.id ? "bg-gray-200" : ""
                }`}
                onClick={() => {
                  setSelected(item.id);
                  setOpen(false);
                  setSearchText(""); // เคลียร์ search เมื่อเลือก item
                }}
              >
                {item.label}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">ไม่พบข้อมูล</div>
          )}
        </div>
      )}
    </div>
  );
}
