import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function PUT(req: NextRequest) {
  let conn = null;
  try {
    const body = await req.json();
    const { old_subject_id, subject_id, subjectName, credit, creditType } = body;
    console.log(body);

    if (!old_subject_id) {
      return NextResponse.json(
        { error: 'old_subject_id is required' },
        { status: 400 }
      );
    }

    conn = await pool.getConnection();

    // ตรวจสอบว่ามี Subject เดิมหรือไม่
    const [rows] = await conn.query(
      'SELECT subject_id FROM Subject WHERE subject_id = ?',
      [old_subject_id]
    );
    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Original subject not found' },
        { status: 404 }
      );
    }

    // ถ้ารหัสใหม่ != รหัสเดิม ให้ตรวจสอบว่ารหัสใหม่ซ้ำหรือไม่
    if (subject_id && subject_id !== old_subject_id) {
      const [checkNew] = await conn.query(
        'SELECT subject_id FROM Subject WHERE subject_id = ?',
        [subject_id]
      );
      if ((checkNew as any[]).length > 0) {
        return NextResponse.json(
          { error: 'New subject_id already exists' },
          { status: 409 }
        );
      }
    }

    // อัปเดตข้อมูลโดยใช้ old_subject_id เป็นเงื่อนไข
    await conn.query(
      `UPDATE Subject SET subject_id = ?, subjectName = ?, credit = ?, creditType = ? WHERE subject_id = ?`,
      [subject_id, subjectName, credit, creditType, old_subject_id]
    );

    return NextResponse.json(
      { message: 'Subject updated successfully', subject_id },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ PUT /api/Subject Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update subject' },
      { status: 500 }
    );

  } finally {
    if (conn) conn.release();
  }
}
