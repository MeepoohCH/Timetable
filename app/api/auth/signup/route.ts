import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

export const runtime = "nodejs";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export async function POST(req: NextRequest) {
  let body: any = {};

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "รูปแบบข้อมูลไม่ถูกต้อง" },
      { status: 400 }
    );
  }

  const username = (body.username || "").toString().trim();
  const password = (body.password || "").toString();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username และ Password จำเป็นต้องกรอก" },
      { status: 400 }
    );
  }

  if (!/^\d{8}$/.test(username)) {
    return NextResponse.json(
      { error: "Username ต้องเป็นรหัสนักศึกษา 8 หลัก" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
      { status: 400 }
    );
  }

  const conn = await pool.getConnection();

  try {
    const hash = await bcrypt.hash(password, 10);

    await conn.query(
      `INSERT INTO users (teacher_id, username, password_hash, role, is_active, created_at)
       VALUES (NULL, ?, ?, 'student', 1, NOW())`,
      [username, hash]
    );

    return NextResponse.json(
      { message: "สมัครสมาชิกสำเร็จ" },
      { status: 201 }
    );
  } catch (err: any) {
    if (err?.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "Username นี้ถูกใช้แล้ว" },
        { status: 409 }
      );
    }

    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}