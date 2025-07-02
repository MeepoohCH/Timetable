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

    // ดึง teacher ID
    const teacherIds = await getTeacherIdsByNames(conn, teacher || []);
    console.log('Teacher IDs:', teacherIds);
    const teacher_id_csv = teacherIds.join(',');

    // 🔍 ตรวจสอบว่าเวลาทับกับคาบอื่นของอาจารย์หรือไม่
    if (teacherIds.length > 0) {
      const placeholders = teacherIds.map(() => `FIND_IN_SET(?, REPLACE(t.teacher_id, ' ', '')) > 0`).join(' OR ');

      const [conflicts] = await conn.query<RowDataPacket[]>(
        `
        SELECT t.timetable_id, t.startTime, t.endTime, t.weekday
        FROM Timetable t
        WHERE t.semester = ? AND t.academicYear = ? AND t.weekday = ?
          AND (${placeholders})
          AND (
            (t.startTime < ? AND t.endTime > ?)
            OR (t.startTime < ? AND t.endTime > ?)
            OR (t.startTime >= ? AND t.endTime <= ?)
          )
        `,
        [
          semester,
          academicYear,
          weekday,
          ...teacherIds,
          study.endTime, study.startTime,
          study.endTime, study.startTime,
          study.startTime, study.endTime
        ]
      );

      if (conflicts.length > 0) {
        return NextResponse.json(
          { error: "อาจารย์มีคาบเรียนทับซ้อนในวันและเวลาดังกล่าว", conflict: conflicts },
          { status: 409 }
        );
      }
    }

    // 🔁 เช็คข้อมูลซ้ำก่อน insert
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
      return NextResponse.json({ message: 'Timetable already exists', timetable_id: existing[0].timetable_id }, { status: 200 });
    }

    // ⏰ บันทึกข้อมูลสอบกลาง/ปลายภาค
    const midterm_id = await getOrCreateExamId(conn, {
      examType: 'midterm',
      ...exam.midterm,
    });

    const final_id = await getOrCreateExamId(conn, {
      examType: 'final',
      ...exam.final,
    });

    // ✅ สร้าง timetable ใหม่
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

    return NextResponse.json({ message: 'Timetable created successfully' }, { status: 201 });

  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create timetable' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
