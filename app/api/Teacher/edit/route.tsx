// /api/teacher/edit.ts

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function PUT(req: NextRequest) {
    const conn = await pool.getConnection();

    try {
        const body = await req.json();

        // 🔍 Log ข้อมูลที่รับมา
        console.log("📥 ข้อมูลที่ได้รับจาก frontend:", body);

        const { teacher_id, teacherName, teacherSurname, role } = body;

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
