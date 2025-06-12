// /api/teacher/get.ts

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(req: NextRequest) {
    const conn = await pool.getConnection();

    try {
        const [rows] = await conn.query(
            `SELECT * FROM Teacher ORDER BY teacher_id ASC`
        );

        return NextResponse.json({ teachers: rows }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        conn.release();
    }
}
