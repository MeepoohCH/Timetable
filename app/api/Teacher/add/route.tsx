// /api/teacher/add.ts

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';

export async function POST(req: NextRequest) {
    const conn = await pool.getConnection();

    try {
        const { teacherName, teacherSurname, role } = await req.json();

        // 🔎 ตรวจสอบว่ามีอาจารย์คนนี้อยู่แล้วหรือยัง
        const [existing] = await conn.query(
            `SELECT teacher_id FROM Teacher WHERE teacherName = ? AND teacherSurname = ? AND role = ?`,
            [teacherName, teacherSurname, role]
        );

        if ((existing as any[]).length > 0) {
            return NextResponse.json({ message: 'Teacher already exists', duplicate: true }, { status: 200 });
        }

       const [rows] = await conn.query<RowDataPacket[]>(
  `SELECT teacher_id FROM Teacher ORDER BY CAST(teacher_id AS UNSIGNED) DESC LIMIT 1`
);


    let nextId: number;

    if (rows.length > 0) {
      const lastId = parseInt((rows[0] as { teacher_id: string }).teacher_id);
      nextId = lastId + 1;
    } else {
      nextId = 1;
    }
        // ➕ Insert new teacher
        await conn.query(
            `INSERT INTO Teacher (teacher_id, teacherName, teacherSurname, role) VALUES (?, ?, ?, ?)`,
            [nextId, teacherName, teacherSurname, role]
        );

        return NextResponse.json({ message: 'Teacher added successfully', teacher_id: nextId }, { status: 201 });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        conn.release();
    }
}
