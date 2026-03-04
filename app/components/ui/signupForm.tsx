"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import Image from "next/image";
import { PasswordInput } from "@/app/components/ui/passwordInput";

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const form = new FormData(e.currentTarget);
    const uname = form.get("uname")?.toString().trim() || "";
    const password = form.get("password")?.toString() || "";
    const confirm = form.get("confirm")?.toString() || "";

    if (!uname || !password || !confirm) {
      setError("กรุณากรอกให้ครบทุกช่อง");
      return;
    }
    if (password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }
    if (password !== confirm) {
      setError("Password และ Confirm Password ไม่ตรงกัน");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: uname, password }),
      });

      const data = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        setError(data?.message || "สมัครสมาชิกไม่สำเร็จ");
        return;
      }

      setSuccess("สมัครสมาชิกสำเร็จ! กำลังพาไปหน้า Login...");
      setTimeout(() => router.replace("/login"), 900);
    } catch {
      setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่");
    }
  };

  return (
    <>
      {/* ✅ glow สีส้มตรงกลาง (เหมือนหน้า Login) */}
      <div
        aria-hidden="true"
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[140px] h-[140px] rounded-full
                   bg-[rgba(248,125,66,0.85)]
                   blur-[48px]
                   shadow-[0_0_80px_40px_rgba(248,125,66,0.6)]
                   pointer-events-none z-0"
      />

      {/* ✅ การ์ดใหญ่ขึ้น + อยู่เหนือ glow */}
      <Card className="relative z-10 bg-white/70 backdrop-blur-md shadow-md rounded-xl w-[460px] max-w-[92vw]">
        {/* ✅ พื้นหลังใน card ให้มีโทนส้มอ่อนเหมือน login */}
        <div className="w-full rounded-xl bg-gradient-to-b from-white via-[#FFE6D4] to-white px-10 py-10">
          <div className="w-full flex justify-center mb-7">
            <Image src="/logo1.png" alt="logo1" width={210} height={86} priority />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#616161] mb-1">
                Username (นักศึกษา)
              </label>
              <Input
                name="uname"
                type="text"
                className="w-full h-[42px] bg-white placeholder:text-sm border border-gray-300 rounded-15px px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
              />

              <label className="block mt-6 text-sm font-medium text-[#616161] mb-1">
                Password
              </label>
              <PasswordInput
                name="password"
                className="w-full h-[42px] bg-white placeholder:text-sm border border-gray-300 rounded-15px px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />

              <label className="block mt-6 text-sm font-medium text-[#616161] mb-1">
                Confirm Password
              </label>
              <PasswordInput
                name="confirm"
                className="w-full h-[42px] bg-white placeholder:text-sm border border-gray-300 rounded-15px px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
              />

              <button
                type="submit"
                className="rounded-15px mt-8 w-full border border-solid border-transparent transition-colors flex items-center justify-center bg-[#F96D00] text-[#ffffff] gap-6 hover:bg-[#ffffff] hover:text-[#F96D00] dark:hover:bg-[#ccc] text-sm sm:text-base h-9 sm:h-11 px-4 sm:px-5"
              >
                SIGN UP
              </button>

              {/* ✅ ลิงก์กลับไปหน้า login */}
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="text-sm text-gray-600 hover:text-[#F96D00] underline underline-offset-4"
                >
                  กลับไปหน้าเข้าสู่ระบบ
                </button>
              </div>
            </div>
          </form>
        </div>
      </Card>

      {/* modal error */}
      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md text-center">
            <h2 className="text-lg font-semibold text-red-600 mb-4">เกิดข้อผิดพลาด</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <div className="flex justify-center">
              <button
                className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-white"
                onClick={() => setError("")}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* modal success */}
      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md text-center">
            <h2 className="text-lg font-semibold text-green-600 mb-4">สำเร็จ</h2>
            <p className="text-gray-700 mb-6">{success}</p>
            <div className="flex justify-center">
              <button
                className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-white"
                onClick={() => {
                  setSuccess("");
                  router.replace("/login");
                }}
              >
                ไปหน้า Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}