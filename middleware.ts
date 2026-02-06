import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

// จำกัดเฉพาะหน้าที่อยากบังคับ role จริง ๆ
const ADMIN_ONLY = ["/addTable"];
const TEACHER_ONLY = ["/teacherData", "/teacherStudy", "/teacherExam"];
const STUDENT_ONLY = ["/studentStudy", "/studentExam"];

const startsWithAny = (pathname: string, list: string[]) =>
  list.some((p) => pathname.startsWith(p));

function redirectToLogin(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/login", req.url));
  res.cookies.delete("session");
  return res;
}

function redirectByRole(req: NextRequest, role: string) {
  if (role === "admin") return NextResponse.redirect(new URL("/addTable", req.url));
  if (role === "teacher") return NextResponse.redirect(new URL("/teacherData", req.url));
  return NextResponse.redirect(new URL("/studentStudy", req.url));
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  //allow: next internals + assets + auth api
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("session")?.value;

  //กรณีพิเศษ: ถ้ามี session แล้วเข้าหน้า /login ให้เด้งออกไปหน้าตาม role
  if (pathname === "/login") {
    if (!token) return NextResponse.next(); // ยังไม่ login ก็เห็นหน้า login ได้
    try {
      const { payload } = await jwtVerify(token, secret);
      const role = String(payload.role || "");
      return redirectByRole(req, role);
    } catch {
      // token เสีย/หมดอายุ → ให้เข้าหน้า login ได้ (และลบ session ทิ้ง)
      const res = NextResponse.next();
      res.cookies.delete("session");
      return res;
    }
  }

  //หน้าอื่นต้องมี session
  if (!token) return redirectToLogin(req);

  //verify token
  try {
    const { payload } = await jwtVerify(token, secret);
    const role = String(payload.role || "");

    //role-based protection เฉพาะหน้าที่กำหนด
    if (startsWithAny(pathname, ADMIN_ONLY) && role !== "admin") return redirectToLogin(req);

    if (startsWithAny(pathname, TEACHER_ONLY) && role !== "teacher" && role !== "admin")
      return redirectToLogin(req);

    if (startsWithAny(pathname, STUDENT_ONLY) && role !== "student" && role !== "admin")
      return redirectToLogin(req);

    // default allow หลัง verify ผ่าน
    return NextResponse.next();
  } catch {
    return redirectToLogin(req);
  }
}

export const config = {
  matcher: ["/:path*"],
};
