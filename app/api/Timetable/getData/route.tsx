import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';

export async function GET(req: NextRequest) {
  let conn = null;

  try {
    const url = new URL(req.url);
    const timetableIdRaw = url.searchParams.get('timetable_id');

    conn = await pool.getConnection();

    let timetable_id: number;

    if (timetableIdRaw) {
      // ใช้ timetable_id จาก query param ถ้ามี
      timetable_id = Number(timetableIdRaw);
      if (isNaN(timetable_id)) {
        return NextResponse.json({ error: 'Invalid timetable_id format' }, { status: 400 });
      }
    } else {
      // ถ้าไม่มี param → ดึง timetable ล่าสุด
      const [latestRows] = await conn.query<RowDataPacket[]>(
        `SELECT timetable_id FROM Timetable ORDER BY created_at DESC LIMIT 1`
      );

      if (latestRows.length === 0) {
        return NextResponse.json({ error: 'No timetable found' }, { status: 404 });
      }

      // เก็บไอดีไว้
      timetable_id = latestRows[0].timetable_id;
    }

    // Query timetable by timetable_id
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT t.*, s.subjectName 
       FROM Timetable t
       JOIN Subject s ON t.subject_id = s.subject_id
       WHERE t.timetable_id = ?`,
      [timetable_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Timetable not found' }, { status: 404 });
    }

    // ส่งกลับข้อมูลพร้อม timetable_id
    return NextResponse.json({
      timetable_id,
      ...rows[0],
    });

  } catch (error: any) {
    console.error('GET timetable error:', error);
    return NextResponse.json({ error: error.message || 'Failed to get timetable' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
