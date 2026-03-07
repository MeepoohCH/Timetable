"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import Image from "next/image";
import { PasswordInput } from "@/app/components/ui/passwordInput";

export function LoginForm({ action }: { action?: (formData: FormData) => void }) {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const uname = form.get("uname")?.toString().trim() || "";
    const password = form.get("password")?.toString() || "";

    if (!uname || !password) {
      setError("กรุณากรอกให้ครบทั้ง Username และ Password");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: uname, password }),
      });

      const data = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        setError(data?.error || "Username หรือ Password ไม่ถูกต้อง");
        return;
      }

      sessionStorage.setItem("role", data?.role || "student");

      if (data?.role === "admin") router.replace("/addTable");
      else if (data?.role === "teacher") router.replace("/teacherData");
      else router.replace("/studentStudy");
    } catch {
      setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่");
    }
  };

  return (
    <>
      <Card className="bg-white/70 backdrop-blur-md shadow-md rounded-xl p-8 w-355 h-512 max-w-sm">
        <div className="w-full flex justify-center mb-6">
          <Image src="/logo1.png" alt="logo1" width={201} height={82} priority />
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="uname" className="block text-sm font-medium text-[#616161] mb-1">
                Username
              </label>

              <Input
                name="uname"
                type="text"
                className="w-full h-[36px] bg-white placeholder:text-sm border border-gray-300 rounded-15px px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
              />

              <label htmlFor="password" className="block mt-6 text-sm font-medium text-[#616161] mb-1">
                Password
              </label>

              <PasswordInput
                name="password"
                className="w-full h-[36px] bg-white placeholder:text-sm border border-gray-300 rounded-15px px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />

              <button
                type="submit"
                className="rounded-15px mt-8 w-full border border-solid border-transparent transition-colors flex items-center justify-center bg-[#F96D00] text-[#ffffff] gap-6 hover:bg-[#ffffff] hover:text-[#F96D00] dark:hover:bg-[#ccc] text-sm sm:text-base h-8 sm:h-10 px-4 sm:px-5"
              >
                LOG IN
              </button>

              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => router.push("/signup")}
                  className="text-sm text-gray-600 hover:text-[#F96D00] underline underline-offset-4"
                >
                  REGISTER
                </button>
              </div>
            </div>
          </form>
        </div>
      </Card>

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
    </>
  );
}