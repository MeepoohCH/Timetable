import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';

interface TeacherRecord extends RowDataPacket {
  teacher_id: string;
}

export async function POST(req: NextRequest) {
  const conn = await pool.getConnection();

  try {
    const { teacherName, teacherSurname, role } = await req.json();

    // ❶ ตรวจสอบว่ามี record ที่ถูกลบอยู่หรือไม่ (จะ reactivate แทนการเพิ่ม)
    const [deleted] = await conn.query<TeacherRecord[]>(
      `SELECT teacher_id FROM Teacher WHERE teacherName = ? AND teacherSurname = ? AND role = ? AND isDeleted = TRUE`,
      [teacherName, teacherSurname, role]
    );

    if (deleted.length > 0) {
      const deletedId = deleted[0].teacher_id;

      await conn.query(
        `UPDATE Teacher SET isDeleted = FALSE WHERE teacher_id = ?`,
        [deletedId]
      );

      return NextResponse.json(
        { message: 'Teacher reactivated successfully', teacher_id: deletedId },
        { status: 200 }
      );
    }

    // ❷ ตรวจสอบว่ามีอาจารย์คนนี้อยู่แล้ว (และไม่ถูกลบ)
    const [existing] = await conn.query<TeacherRecord[]>(
      `SELECT teacher_id FROM Teacher WHERE teacherName = ? AND teacherSurname = ? AND role = ? AND isDeleted = FALSE`,
      [teacherName, teacherSurname, role]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { message: 'Teacher already exists', duplicate: true },
        { status: 200 }
      );
    }

    // ❸ หา teacher_id ถัดไป
    const [rows] = await conn.query<TeacherRecord[]>(
      `SELECT teacher_id FROM Teacher ORDER BY CAST(teacher_id AS UNSIGNED) DESC LIMIT 1`
    );

    let nextId: number;

    if (rows.length > 0) {
      const lastId = parseInt(rows[0].teacher_id);
      nextId = lastId + 1;
    } else {
      nextId = 1;
    }

    // ❹ Insert ใหม่ (isDeleted = FALSE โดย default หรือใส่ชัดเจนก็ได้)
    await conn.query(
      `INSERT INTO Teacher (teacher_id, teacherName, teacherSurname, role, isDeleted)
       VALUES (?, ?, ?, ?, FALSE)`,
      [nextId, teacherName, teacherSurname, role]
    );

    return NextResponse.json(
      { message: 'Teacher added successfully', teacher_id: nextId },
      { status: 201 }
    );

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    conn.release();
  }
}
