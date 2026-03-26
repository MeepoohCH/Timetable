import { NextRequest, NextResponse } from "next/server";
import { pool } from '../../../../lib/db';

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { subject_id } = body;

    console.log("📥 ลบ subject_id:", subject_id);

    if (!subject_id) {
      return NextResponse.json({ error: "กรุณาระบุ subject_id" }, { status: 400 });
    }

    // ตรวจสอบก่อนว่ามีจริงไหม
    const [rows] = await pool.query('SELECT * FROM Subject WHERE subject_id = ?', [subject_id]);
    if ((rows as any[]).length === 0) {
      return NextResponse.json({ error: "ไม่พบวิชาในระบบ" }, { status: 404 });
    }

    // ลบ
    await pool.query('DELETE FROM Subject WHERE subject_id = ?', [subject_id]);

    console.log("✅ ลบสำเร็จ:", subject_id);
    return NextResponse.json({ message: "Subject deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("❌ ลบวิชาผิดพลาด:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายใน" }, { status: 500 });
  }
}
