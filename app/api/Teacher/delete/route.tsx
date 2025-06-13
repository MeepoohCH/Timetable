// /app/api/teacher/delete.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db"; // สมมุติว่าคุณมี pool เชื่อม MySQL ไว้แล้ว

export async function DELETE(req: NextRequest) {
  const conn = await pool.getConnection();

  try {
    const body = await req.json();
    const { teacher_id } = body;

    console.log("🗑️ ลบ teacher_id:", teacher_id);

    if (!teacher_id) {
      return NextResponse.json({ error: "Missing teacher_id" }, { status: 400 });
    }

    const [result] = await conn.query(
      `DELETE FROM Teacher WHERE teacher_id = ?`,
      [teacher_id]
    );

    console.log("✅ ลบข้อมูลแล้ว:", result);

    return NextResponse.json({ message: "ลบอาจารย์สำเร็จ" }, { status: 200 });
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการลบ:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    conn.release();
  }
}
