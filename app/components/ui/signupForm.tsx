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

    if (!/^\d{8}$/.test(uname)) {
      setError("Username ต้องเป็นรหัสนักศึกษา 8 หลัก");
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
        setError(data?.message || data?.error || "สมัครสมาชิกไม่สำเร็จ");
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
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          backgroundColor: "rgba(248, 125, 66, 0.8)",
          filter: "blur(40px)",
          boxShadow: "rgba(248, 125, 66, 0.7) 0px 0px 60px 30px",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <Card className="bg-white/70 backdrop-blur-md shadow-md rounded-xl p-8 w-[400px] h-auto max-w-sm relative z-10">
        <div className="w-full flex justify-center mb-6">
          <Image
            src="/logo1.png"
            alt="logo1"
            width={201}
            height={82}
            priority
          />
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="uname"
                className="block text-sm font-medium text-[#616161] mb-1"
              >
                Username (รหัสนักศึกษา)
              </label>

              <Input
                name="uname"
                type="text"
                autoFocus
                autoComplete="username"
                maxLength={8}
                inputMode="numeric"
                pattern="\d{8}"
                onInvalid={(e) =>
                  (e.currentTarget as HTMLInputElement).setCustomValidity(
                    "กรุณากรอกรหัสนักศึกษา 8 หลัก"
                  )
                }
                onInput={(e) =>
                  (e.currentTarget as HTMLInputElement).setCustomValidity("")
                }
                className="w-full h-[36px] bg-white placeholder:text-sm border border-gray-300 rounded-15px px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Username"
              />
              <label
                htmlFor="password"
                className="block mt-6 text-sm font-medium text-[#616161] mb-1"
              >
                Password
              </label>

              <PasswordInput
                name="password"
                autoComplete="new-password"
                className="w-full h-[36px] bg-white placeholder:text-sm border border-gray-300 rounded-15px px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />

              <label
                htmlFor="confirm"
                className="block mt-6 text-sm font-medium text-[#616161] mb-1"
              >
                Confirm Password
              </label>

              <PasswordInput
                name="confirm"
                autoComplete="new-password"
                className="w-full h-[36px] bg-white placeholder:text-sm border border-gray-300 rounded-15px px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
              />

              <button
                type="submit"
                className="rounded-15px mt-8 w-full border border-solid border-transparent transition-colors flex items-center justify-center bg-[#F96D00] text-[#ffffff] gap-6 hover:bg-[#ffffff] hover:text-[#F96D00] dark:hover:bg-[#ccc] text-sm sm:text-base h-8 sm:h-10 px-4 sm:px-5"
              >
                SIGN UP
              </button>

              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="text-sm text-gray-600 hover:text-[#F96D00] underline underline-offset-4"
                >
                  LOGIN
                </button>
              </div>
            </div>
          </form>
        </div>
      </Card>

      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md text-center">
            <h2 className="text-lg font-semibold text-red-600 mb-4">
              เกิดข้อผิดพลาด
            </h2>
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