import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { getOrCreateExamId } from '@/lib/exam';
import { getTeacherIdsByNames } from '@/lib/teacher';
import { updateTimetable, findTimetableIdByFields } from '@/lib/timetable';
import { RowDataPacket } from 'mysql2/promise';


    // ✅ ดึงข้อมูลอาจารย์ทั้งหมดเพื่อเรียงตามชื่อจริง
interface TeacherRow extends RowDataPacket {
  teacher_id: string;
  role: string;
  teacherName: string;
  teacherSurname: string;
}


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


const [allTeachers] = await conn.query<TeacherRow[]>(
  'SELECT teacher_id, role, teacherName, teacherSurname FROM Teacher'
);

// ✅ จับคู่และเรียง
const sortedTeacherIds = teacherIds
  .map((id) => {
    const t = allTeachers.find((x) => x.teacher_id === id);
    return {
      id,
      fullName: t ? `${t.teacherName} ${t.teacherSurname}` : id,
    };
  })
  .sort((a, b) => a.fullName.localeCompare(b.fullName))
  .map((t) => t.id);

console.log('🔤 Sorted teacher IDs:', sortedTeacherIds);


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
// 🔍 ตรวจสอบว่าอาจารย์มีคาบทับกันไหม (ยกเว้นตารางที่กำลังอัปเดตอยู่)
if (sortedTeacherIds.length > 0) {
  const placeholders = sortedTeacherIds.map(() => `FIND_IN_SET(?, REPLACE(t.teacher_id, ' ', '')) > 0`).join(' OR ');

  const [conflicts] = await conn.query<RowDataPacket[]>(
    `
    SELECT t.timetable_id, t.startTime, t.endTime, t.weekday
    FROM Timetable t
    WHERE t.semester = ? AND t.academicYear = ? AND t.weekday = ?
      AND (${placeholders})
      AND t.timetable_id != ?  -- ยกเว้นตัวที่กำลังแก้ไข
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
      ...sortedTeacherIds,
      timetable_id,  // เว้นตัวที่อัปเดตอยู่
      study.endTime, study.startTime,
      study.endTime, study.startTime,
      study.startTime, study.endTime,
    ]
  );

  if (conflicts.length > 0) {
    return NextResponse.json(
      { error: "อาจารย์มีคาบเรียนทับซ้อนในวันและเวลาดังกล่าว", conflict: conflicts },
      { status: 409 }
    );
  }
}

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
      teacherIds: sortedTeacherIds,
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
