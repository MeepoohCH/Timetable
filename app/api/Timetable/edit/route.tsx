import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { getOrCreateExamId } from '@/lib/exam';
import { getTeacherIdsByNames } from '@/lib/teacher';
import { updateTimetable, findTimetableIdByFields } from '@/lib/timetable';
import { RowDataPacket } from 'mysql2/promise';

export async function PUT(req: NextRequest) {
  let conn = null;

  try {
    const body = await req.json();
    console.log('Updating timetable:', body);

    let {
      timetable_id,
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

    // ✅ ถ้าไม่มี timetable_id → ค้นหาจาก field อื่น ๆ
    if (!timetable_id) {
      console.log('No timetable_id provided, searching by other fields...');
      timetable_id = await findTimetableIdByFields(conn, {
        subject_id,
        subjectType,
        yearLevel,
        degree,
        sec,
        semester,
        academicYear,
        weekday,
        study
      });

      if (!timetable_id) {
        console.log('Timetable ID not found for update.');
        return NextResponse.json({ error: 'Timetable ID not found for update' }, { status: 404 });
      }

      console.log('Found timetable_id:', timetable_id);
    }

    // ✅ แปลงรายชื่ออาจารย์เป็น teacherIds
    const teacherIds = await getTeacherIdsByNames(conn, teacher || []);
    console.log('Teacher IDs:', teacherIds);

    // ✅ ดึง/สร้าง midterm/final exam id
    const midterm_id = await getOrCreateExamId(conn, {
      examType: 'midterm',
      date: exam.midterm.date,
      startTime: exam.midterm.startTime,
      endTime: exam.midterm.endTime,
      location: exam.midterm.location,
    });

    const final_id = await getOrCreateExamId(conn, {
      examType: 'final',
      date: exam.final.date,
      startTime: exam.final.startTime,
      endTime: exam.final.endTime,
      location: exam.final.location,
    });

    // ✅ อัปเดต timetable
    await updateTimetable(conn, {
      timetable_id,
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

    console.log('Timetable updated.');
    return NextResponse.json({ message: 'Timetable updated successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update timetable' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
