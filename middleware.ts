import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

const HOME_BY_ROLE: Record<string, string> = {
  admin: "/addTable",
  teacher: "/teacherData",
  student: "/studentStudy",
};

const STUDENT_ALLOW = ["/studentStudy", "/teacherStudy"];

// ✅ เพิ่ม public routes
const PUBLIC_ROUTES = ["/login", "/signup"];

function startsWithAny(pathname: string, list: string[]) {
  return list.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function redirectToLogin(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/login", req.url));
  res.cookies.delete("session");
  return res;
}

function redirectHome(req: NextRequest, role: string) {
  const dest = HOME_BY_ROLE[role] || "/login";
  return NextResponse.redirect(new URL(dest, req.url));
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // ไม่ให้ middleware ยุ่งกับ API
  if (pathname.startsWith("/api")) return NextResponse.next();

  // next internals / static
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("session")?.value;

  // ✅ เปิด /login และ /signup ให้เข้าตอนยังไม่ login ได้
  if (startsWithAny(pathname, PUBLIC_ROUTES)) {
    // ถ้ายังไม่ login → เข้าได้
    if (!token) return NextResponse.next();

    // ถ้า login อยู่แล้ว → เด้งไปหน้า home ตาม role
    try {
      const { payload } = await jwtVerify(token, secret);
      return redirectHome(req, String(payload.role || ""));
    } catch {
      const res = NextResponse.next();
      res.cookies.delete("session");
      return res;
    }
  }

  // หน้าอื่น ๆ ต้องมี token
  if (!token) return redirectToLogin(req);

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = String(payload.role || "");

    if (role === "admin") return NextResponse.next();

    if (role === "teacher") {
      if (pathname === "/addTable" || pathname.startsWith("/addTable/")) {
        return redirectHome(req, role);
      }
      return NextResponse.next();
    }

    if (role === "student") {
      if (!startsWithAny(pathname, STUDENT_ALLOW)) {
        return redirectHome(req, role);
      }
      return NextResponse.next();
    }

    return redirectToLogin(req);
  } catch {
    return redirectToLogin(req);
  }
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|api|.*\\.(?:png|jpg|jpeg|gif|svg|css|js|map)$).*)",
  ],
};