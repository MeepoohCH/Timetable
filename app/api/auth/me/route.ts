import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  if (!token) return NextResponse.json({ loggedIn: false }, { status: 401 });

  try {
    const { payload } = await jwtVerify(token, secret);
    return NextResponse.json({
      loggedIn: true,
      role: String(payload.role || ""),
      id: payload.id,
    });
  } catch {
    const res = NextResponse.json({ loggedIn: false }, { status: 401 });
    res.cookies.delete("session");
    return res;
  }
}
