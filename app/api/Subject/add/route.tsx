import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../../lib/db';

export async function POST(req: NextRequest) {
  let conn = null;

  try {
    const body = await req.json();
    const { subject_id, subjectName, credit, creditType } = body;

    console.log('📥 Creating subject:', body);

    conn = await pool.getConnection();

    // 🔍 ตรวจสอบว่ามี subject_id นี้อยู่แล้วหรือยัง
    const [existingRows] = await conn.query(
      'SELECT subject_id FROM Subject WHERE subject_id = ?',
      [subject_id]
    );

    if ((existingRows as any[]).length > 0) {
      console.log(`⚠️ Subject ID '${subject_id}' มีอยู่แล้ว`);
      return NextResponse.json(
        { message: 'Subject already exists', subject_id },
        { status: 200 }
      );
    }

    // ✅ ถ้ายังไม่มี, ทำการเพิ่ม
    const cleanedCreditType = creditType.replace(/[()]/g, '');
    await conn.query(
      `INSERT INTO Subject (subject_id, subjectName, credit, creditType) VALUES (?, ?, ?, ?)`,
      [subject_id, subjectName, credit, cleanedCreditType]
    );

    console.log('✅ สร้าง Subject ใหม่สำเร็จ');
    return NextResponse.json(
      { message: 'Subject created successfully', subject_id },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('❌ POST /api/Subject Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create subject' },
      { status: 500 }
    );

  } finally {
    if (conn) conn.release();
  }
}
