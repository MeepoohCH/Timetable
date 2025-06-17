import { useState, useRef, useEffect } from "react"

export default function TeacherMakeUpInput ({
  label,
  teachers,
  selected,
  setSelected,
}: {
  label: string
  teachers: string[]
  selected: string
  setSelected: (val: string) => void
}) {
  const [query, setQuery] = useState("")
  const [filtered, setFiltered] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // คัดกรองรายชื่ออาจารย์ตาม query
  useEffect(() => {
    const result = teachers.filter((name) =>
      name.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    )
    setFiltered(result)
  }, [query, teachers])

  return (
    <div className="relative" ref={ref}>
      <label className="text-sm">{label}</label>
      <input
        type="text"
        value={query}
        onFocus={() => {
          if (query.length > 0) setOpen(true)
        }}
        onBlur={() => {
          // delay 100ms เพื่อให้คลิก dropdown ได้ก่อนปิด
          setTimeout(() => setOpen(false), 150)
        }}
        onChange={(e) => {
          const value = e.target.value
          setQuery(value)
          setSelected("")
          setOpen(value.length > 0) // เปิด dropdown เมื่อมีข้อความ
        }}
        className="flex items-center justify-between border border-gray-300 rounded-[10px] w-60 bg-white text-sm px-2 py-1"
        placeholder="พิมพ์ชื่ออาจารย์"
      />

      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border text-sm rounded shadow max-h-60 overflow-auto">
          {filtered.map((name) => (
            <div
              key={name}
              className={`cursor-pointer px-4 py-2 hover:bg-[#F96D00] hover:text-white ${
                selected === name ? "bg-gray-200" : ""
              }`}
              onMouseDown={() => {
                setSelected(name)
                setQuery(name)
                setOpen(false)
              }}
            >
              {name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
