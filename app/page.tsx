"use client"

import { useRouter } from "next/navigation"




export default function WelcomePage() {
  const router = useRouter()

  const handleStart = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-xl max-w-md w-full p-10 text-center text-gray-600">
        <h1 className="text-4xl font-extrabold mb-6 drop-shadow-lg">
          Welcome to Scheduling System
        </h1>
        <p className="text-lg mb-6 drop-shadow-sm">
          ระบบจัดตารางเรียนที่ใช้งานง่าย ช่วยให้คุณวางแผนตารางเรียนได้รวดเร็วและมีประสิทธิภาพ
        </p>
        <div className="flex justify-center">
          <button
            className="rounded-[15px] w-30 border border-solid border-transparent transition-colors flex items-center justify-center bg-[#F96D00] text-[#ffffff] gap-6 hover:bg-[#ffffff] hover:text-[#F96D00] dark:hover:bg-[#ccc] text-sm sm:text-base h-8 sm:h-10 px-4 sm:px-5"
            onClick={handleStart}
          >
            เริ่มใช้งาน
          </button>
        </div>
      </div>
    </div>
  )
}

