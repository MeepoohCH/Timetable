import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { getOrCreateExamId } from '@/lib/exam';
import { getTeacherIdsByNames } from '@/lib/teacher';
import { createTimetable, updateTimetable, deleteTimetable, findTimetableIdByFields } from '@/lib/timetable';
import { RowDataPacket } from 'mysql2/promise';


export async function POST(req: NextRequest) {
  let conn = null;

  try {
    const body = await req.json();
    console.log('Creating timetable:', body);

    const {
      subject_id,
      subjectType,
      yearLevel,
      degree,
      sec,
      semester,
      academicYear,
      weekday,
      study,
      teacher,
      exam
    } = body;

    conn = await pool.getConnection();

 /*   const subjectName = await getSubjectNameById(conn, subject_id);
    if (!subjectName) {
      const url = new URL('/SubjectData', req.url);  // สร้าง absolute URL
      url.searchParams.set('error', 'Subject not found'); // ส่งข้อความผ่าน query string

      return NextResponse.redirect(url.toString(), 302);
    }

    */
    // เช็คว่ามี timetable ที่ข้อมูลซ้ำกันหรือยัง
    
   
    const teacherIds = await getTeacherIdsByNames(conn, teacher || []);
    console.log('Teacher IDs:', teacherIds);
    const teacher_id_csv = teacherIds.join(',');

    // ตัวอย่าง query เช็ค timetable ซ้ำ (สมมติเรียง field ตาม create)
    const [existing] = await conn.query<RowDataPacket[]>(
      `SELECT timetable_id FROM Timetable WHERE
        subject_id = ? AND subjectType = ? AND yearLevel = ? AND degree = ? AND sec = ? AND
        semester = ? AND academicYear = ? AND weekday = ? AND startTime = ? AND endTime = ? AND
        location = ? AND teacher_id = ?`,
      [
        subject_id,
        subjectType,
        yearLevel,
        degree,
        sec,
        semester,
        academicYear,
        weekday,
        study.startTime,
        study.endTime,
        study.location,
        teacher_id_csv
      ]
    );

    if (existing.length > 0) {
      console.log('Duplicate timetable found, skipping insert:', existing[0].timetable_id);
      return NextResponse.json({ message: 'Timetable already exists', timetable_id: existing[0].timetable_id }, { status: 200 });
    }


    

    const midterm_id = await getOrCreateExamId(conn, {
      examType: 'midterm',
      ...exam.midterm,
    });
    console.log('Midterm exam ID:', midterm_id);

    const final_id = await getOrCreateExamId(conn, {
      examType: 'final',
      ...exam.final,
    });
    console.log('Final exam ID:', final_id);

    await createTimetable(conn, {
      subject_id,
      subjectType,
      yearLevel,
      degree,
      sec,
      semester,
      academicYear,
      weekday,
      study,
      teacherIds,
      midterm_id,
      final_id,
    });
    console.log('Timetable created.');

    return NextResponse.json({ message: 'Timetable created successfully' }, { status: 201 });

  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create timetable' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}

