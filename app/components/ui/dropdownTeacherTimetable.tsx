"use client";
import { useState, useEffect, useRef } from "react";

export default function DropdownTeacherTimetable({
  label,
  selected,
  setSelected,
}: {
  label: string;
  selected: string[];
  setSelected: (val: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<{ id: string; label: string }[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("mousedown", (e) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    });
    return () => document.removeEventListener("mousedown", () => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch("/api/Teacher/dropdown")
      .then((res) => res.json())
      .then((data) => {
        const formatted = (data.teachers || []).map((t: any) => ({
          id: t.teacher_id,
          label: `${t.teacherName} ${t.teacherSurname}`,
        }));
        setItems(formatted);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((i) =>
    i.label.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div ref={ref} className="relative max-w-[250px] w-full">
      <label className="text-sm">{label}</label>
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="w-full bg-white text-sm px-2 py-1 border border-gray-300 rounded-lg truncate text-left "
      >
        {selected.length > 0
          ? selected.join(", ")
          : loading
          ? "กำลังโหลด..."
          : "เลือก..."}
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded shadow text-sm max-h-52 overflow-auto">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="ค้นหา..."
            className="w-full px-2 py-1 border-b text-sm outline-none"
            autoFocus
          />
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const isSelected = selected.includes(item.label);
              return (
                <div
                  key={item.id}
                  className={`px-3 py-1 cursor-pointer hover:bg-orange-500 hover:text-white ${
                    isSelected ? "bg-gray-200" : ""
                  }`}
                  onClick={() => {
                    const updated = isSelected
                      ? selected.filter((l) => l !== item.label)
                      : [...selected, item.label];
                    setSelected(updated);
                    setSearchText("");
                  }}
                >
                  {item.label}
                </div>
              );
            })
          ) : (
            <div className="px-3 py-2 text-gray-500">ไม่พบข้อมูล</div>
          )}
        </div>
      )}
    </div>
  );
}
