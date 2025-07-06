import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../../lib/db';

export async function PUT(req: NextRequest) {
  const conn = await pool.getConnection();

  try {
    const body = await req.json();
    console.log("📥 ข้อมูลที่ได้รับจาก frontend:", body);

    const { teacher_id, teacherName, teacherSurname, role } = body;

    // ❶ เช็คว่ามีอาจารย์ที่ชื่อซ้ำกับคนอื่นอยู่หรือไม่ (ยกเว้นตัวเอง)
    const [existing] = await conn.query(
      `SELECT teacher_id FROM Teacher WHERE teacherName = ? AND teacherSurname = ? AND role = ? AND teacher_id <> ? AND isDeleted = FALSE`,
      [teacherName, teacherSurname, role, teacher_id]
    );

    // @ts-ignore
    if (existing.length > 0) {
      return NextResponse.json(
        { message: 'Duplicate teacher exists', duplicate: true },
        { status: 400 }
      );
    }

    // ❷ อัปเดตข้อมูล
    const [result] = await conn.query(
      `UPDATE Teacher SET teacherName = ?, teacherSurname = ?, role = ? WHERE teacher_id = ?`,
      [teacherName, teacherSurname, role, teacher_id]
    );

    console.log("DB update result:", result);

    return NextResponse.json({ message: 'Teacher updated successfully' }, { status: 200 });
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาด:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    conn.release();
  }
}
