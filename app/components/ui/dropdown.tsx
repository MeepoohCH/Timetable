import { useState, useRef,useEffect } from "react"

export default function Dropdown ({
  label,
  items,
  selected,
  setSelected,
}: {
  label: string
  items: {id: number | string ; label: string}[]
  selected: number| string | null
  setSelected: (val: number | string ) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
      function onClickOutside(e:MouseEvent){
        if(ref.current && !ref.current.contains(e.target as Node)){
          setOpen(false)
        }
      }
      document.addEventListener("mousedown", onClickOutside)
      return () => document.removeEventListener("mousedown", onClickOutside)
    },[]
  )

  return (
    <div className="relative w-full max-w-xs sm:max-w-[128px]" ref={ref}>
      <label className="text-sm" > {label} </label>
      <button
        className="flex items-center justify-between border border-gray-300 rounded-[10px] w-32 bg-white text-sm px-2 py-1"
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
          {items.map((item) => (
            <div 
              className={`cursor-pointer px-4 py-2 hover:bg-[#F96D00] hover:text-white ${
                selected === item.id ? "bg-gray-200" : ""
              }`}
              key={item.id}
              onClick={() => {
                setSelected(item.id)
                setOpen(false)
              }} 
            >
              {item.label}
            </div>
          ))}
        </div>
      )
      }
    </div>
  )
}
