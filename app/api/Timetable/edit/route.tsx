import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../../lib/db';
import { getOrCreateExamId } from '@/lib/exam';
import { getTeacherIdsByNames } from '@/lib/teacher';
import { updateTimetable, findTimetableIdByFields } from '@/lib/timetable';
import { RowDataPacket, PoolConnection } from 'mysql2/promise';

interface TeacherRow extends RowDataPacket {
  teacher_id: string;
  role: string;
  teacherName: string;
  teacherSurname: string;
}

export async function PUT(req: NextRequest) {
  
  let conn: PoolConnection | null = null;

  try {
    const body = await req.json();
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
      exam,
    } = body;

    conn = await pool.getConnection();
    await conn.beginTransaction();

    if (!timetable_id) {
      timetable_id = await findTimetableIdByFields(conn, {
        subject_id,
        subjectType,
        yearLevel,
        degree,
        sec,
        semester,
        academicYear,
        weekday,
        study,
      });

      if (!timetable_id) {
        await conn.rollback();
        return NextResponse.json({ error: 'Timetable ID not found for update' }, { status: 404 });
      }
    }

    const teacherIds = await getTeacherIdsByNames(conn, teacher || []);
    const [allTeachers] = await conn.query<TeacherRow[]>(
      'SELECT teacher_id, role, teacherName, teacherSurname FROM Teacher'
    );

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
    // ลบ timetable_id ที่ overwrite ถ้ามีและไม่เท่ากับ timetable_id ตัวที่แก้ไข
    const overwriteIdNum = Number(body.overwriteId);
    console.log('overwriteIdNum:', overwriteIdNum, 'timetable_id:', timetable_id);

    if (!isNaN(overwriteIdNum) && overwriteIdNum !== timetable_id) {
      console.log('🗑 ลบ timetable_id ที่ overwrite:', overwriteIdNum);
      await conn.query(`DELETE FROM Timetable WHERE timetable_id = ?`, [overwriteIdNum]);
    } else {
      console.log('ไม่ลบ เพราะ overwriteId ไม่มีค่า หรือ เท่ากับ timetable_id');
    }



    // เช็คคาบซ้อน
    if (sortedTeacherIds.length > 0) {
      const placeholders = sortedTeacherIds.map(() => `FIND_IN_SET(?, REPLACE(t.teacher_id, ' ', '')) > 0`).join(' OR ');

      const [conflicts] = await conn.query<RowDataPacket[]>(
        `
        SELECT t.timetable_id, t.startTime, t.endTime, t.weekday, t.subject_id
        FROM Timetable t
        WHERE t.semester = ? AND t.academicYear = ? AND t.weekday = ?
          AND (${placeholders})
          AND t.timetable_id != ?
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
          timetable_id,
          study.endTime,
          study.startTime,
          study.endTime,
          study.startTime,
          study.startTime,
          study.endTime,
        ]
      );

      if (conflicts.length > 0) {
        await conn.rollback();

        const conflictRow = conflicts[0];
        const conflictSubjectId = conflictRow.subject_id;
        let conflictSubjectName = conflictSubjectId;

        if (conflictSubjectId) {
          const [conflictSubjectRows] = await conn.query<RowDataPacket[]>(
            `SELECT subjectName FROM Subject WHERE subject_id = ?`,
            [conflictSubjectId]
          );
          conflictSubjectName = conflictSubjectRows[0]?.subjectName || conflictSubjectId;
        }

        // ดึงชื่ออาจารย์ที่เกี่ยวข้อง
        const conflictTeachers = sortedTeacherIds.map((id) => {
          const t = allTeachers.find((x) => x.teacher_id === id);
          return t ? `${t.role}${t.teacherName} ${t.teacherSurname}` : id;
        });

        return NextResponse.json({
          error: 'อาจารย์มีคาบเรียนทับซ้อนในวันและเวลาดังกล่าว',
          conflictData: {
            timetable_id: conflictRow.timetable_id,
            subject_id: conflictRow.subject_id,
            subjectName: conflictSubjectName,
            weekday: conflictRow.weekday,
            study: {
              startTime: conflictRow.startTime,
              endTime: conflictRow.endTime,
              location: conflictRow.location ?? "",
            },
            teacher: conflictTeachers,
          },
        }, { status: 409 });
      }
    }

    // ดึง/สร้าง midterm/final exam id
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
    


    // อัพเดต timetable ตัวใหม่
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

    await conn.commit();
    console.log('Timetable updated.');
    return NextResponse.json({ message: 'Timetable updated successfully' }, { status: 200 });
  } catch (error: any) {
    if (conn) await conn.rollback();
    console.error('PUT error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update timetable' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
