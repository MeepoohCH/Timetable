"use client";

import * as React from "react";
import { Button } from "./ui/button";

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

import { Check, ChevronDown } from "lucide-react";

type TeacherOption = {
  id: string;
  label: string;
};

export default function TeacherMultiSelect({
  selectedTeachers,
  setSelectedTeachers,
}: {
  selectedTeachers: string[]; // เก็บ id ครูที่เลือก
  setSelectedTeachers: (value: string[]) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const [teacherOptions, setTeacherOptions] = React.useState<TeacherOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchTeachers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/Teacher/dropdown");
        if (!res.ok) throw new Error("โหลดอาจารย์ล้มเหลว");
        const data = await res.json();
        // สมมติ data.teachers เป็น array ที่มี teacher_id และ teacherName, teacherSurname
        const formatted = Array.isArray(data.teachers)
          ? data.teachers.map((t: any) => ({
            id: `${t.teacherName} ${t.teacherSurname}`,
            label: `${t.teacherName} ${t.teacherSurname}`,
          }))
          : [];
        setTeacherOptions(formatted);
      } catch (err: any) {
        setError(err.message || "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    }
    fetchTeachers();
  }, []);

  // กรองครูตาม searchText (ไม่สนใจ case)
  const filteredTeachers = teacherOptions.filter((t) =>
    t.label.toLowerCase().includes(searchText.toLowerCase())
  );

  // toggle เลือก/ไม่เลือกครู
  const toggleTeacher = (id: string) => {
    if (selectedTeachers.includes(id)) {
      setSelectedTeachers(selectedTeachers.filter((t) => t !== id));
    } else {
      setSelectedTeachers([...selectedTeachers, id]);
    }
  };

  // แสดงชื่อครูที่เลือก (แปลง id เป็น label)
  const selectedLabels = selectedTeachers
    .map((id) => teacherOptions.find((t) => t.id === id)?.label)
    .filter(Boolean)
    .join(", ");


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="boxT h-[29.46px] justify-between w-[280px] whitespace-normal break-words"
          style={{ whiteSpace: "normal" }}
          disabled={loading}
          
        >
          <span
            className="truncate block whitespace-nowrap overflow-hidden text-ellipsis w-full text-[#11181C] font-normal"
          >
          {selectedLabels.length > 0 ? selectedLabels : ""}

          </span>

          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

     <PopoverContent
  side="bottom"
  align="center"
  sideOffset={4}
  collisionPadding={8}  // เว้นขอบ 8px ให้เลื่อนเลี่ยงขอบหน้าจอได้
  className="w-[200px] p-0 max-h-60 overflow-auto"
>
        <Command>
          <CommandInput
            placeholder="ค้นหา..."
            value={searchText}
            onValueChange={setSearchText}
            autoFocus
          />
          <CommandGroup>
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <CommandItem
                  key={teacher.id}
                  onSelect={() => toggleTeacher(teacher.id)}
                  className="flex items-center justify-between"
                >
                  <span>{teacher.label}</span>
                  {selectedTeachers.includes(teacher.id) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </CommandItem>
              ))
            ) : (
              <CommandItem disabled>
                ไม่พบข้อมูล
              </CommandItem>
            )}
          </CommandGroup>
        </Command>
        {error && (
          <div className="p-2 text-red-500 text-sm">{error}</div>
        )}
      </PopoverContent>
    </Popover>
  );
}
