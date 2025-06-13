import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(req: NextRequest) {
    const conn = await pool.getConnection();

    try {
        const [rows] = await conn.query(
            `SELECT * FROM Subject ORDER BY subject_id ASC`
        );
        return NextResponse.json({ subjects: rows }, { status: 200 });  // <-- แก้ตรงนี้
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        conn.release();
    }
}
