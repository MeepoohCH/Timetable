import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

const HOME_BY_ROLE: Record<string, string> = {
  admin: "/addTable",
  teacher: "/teacherData",
  student: "/studentStudy",
};

// ✅ student เห็นแค่ 2 หน้าเท่านั้น
const STUDENT_ALLOW = ["/studentStudy", "/teacherStudy"];

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

  // ✅ ไม่ให้ middleware ยุ่งกับ API เลย
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("session")?.value;

  if (pathname === "/login") {
    if (!token) return NextResponse.next();
    try {
      const { payload } = await jwtVerify(token, secret);
      return redirectHome(req, String(payload.role || ""));
    } catch {
      const res = NextResponse.next();
      res.cookies.delete("session");
      return res;
    }
  }

  if (!token) return redirectToLogin(req);

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = String(payload.role || "");

    if (role === "admin") return NextResponse.next();
    if (role === "teacher") return NextResponse.next();

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

