// /api/teacher/edit.ts

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function PUT(req: NextRequest) {
    const conn = await pool.getConnection();

    try {
        const { teacher_id, teacherName, teacherSurname, role } = await req.json();

        const [result] = await conn.query(
            `UPDATE Teacher SET teacherName = ?, teacherSurname = ?, role = ? WHERE teacher_id = ?`,
            [teacherName, teacherSurname, role, teacher_id]
        );

        return NextResponse.json({ message: 'Teacher updated successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        conn.release();
    }
}
