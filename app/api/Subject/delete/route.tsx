import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function DELETE(req: NextRequest) {
  let conn = null;
  try {
    const { searchParams } = new URL(req.url);
    const subject_id = searchParams.get('subject_id');

    if (!subject_id) {
      return NextResponse.json(
        { error: 'subject_id query parameter is required' },
        { status: 400 }
      );
    }

    conn = await pool.getConnection();

    // ตรวจสอบว่ามี Subject นี้ไหม
    const [rows] = await conn.query(
      'SELECT subject_id FROM Subject WHERE subject_id = ?',
      [subject_id]
    );

    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      );
    }

    // ลบ Subject
    await conn.query('DELETE FROM Subject WHERE subject_id = ?', [subject_id]);

    return NextResponse.json(
      { message: 'Subject deleted successfully', subject_id },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ DELETE /api/Subject Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete subject' },
      { status: 500 }
    );

  } finally {
    if (conn) conn.release();
  }
}
