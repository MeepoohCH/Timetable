import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  let conn: mysql.Connection | null = null;

  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Missing username or password" },
        { status: 400 }
      );
    }

    // Rate limit (5 ครั้ง/นาที ต่อ IP+username)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const key = `login:${ip}:${String(username).toLowerCase()}`;
    const rl = rateLimit(key, 5, 60_000);

    if (!rl.ok) {
      return NextResponse.json(
        { error: "พยายามเข้าสู่ระบบบ่อยเกินไป กรุณารอ 1 นาทีแล้วลองใหม่" },
        { status: 429 }
      );
    }

    //  Connect DB
    conn = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    const [rows]: any = await conn.execute(
      "SELECT id, username, password_hash, role, is_active FROM users WHERE username = ? LIMIT 1",
      [username]
    );

    // อย่าเฉลยว่าผิดเพราะ user ไม่มีหรือปิดใช้งาน (กัน enumerate)
    if (!rows.length || !rows[0].is_active) {
      return NextResponse.json(
        { error: "Username หรือ Password ไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return NextResponse.json(
        { error: "Username หรือ Password ไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    //   JWT อายุ 8 ชั่วโมง
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "8h" }
    );

    const res = NextResponse.json({ success: true, role: user.role });

    //   httpOnly cookie อายุ 8 ชั่วโมง
    res.cookies.set("session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    if (conn) await conn.end();
  }
}
