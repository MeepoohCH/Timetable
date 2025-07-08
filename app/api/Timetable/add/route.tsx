import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../../lib/db';
import { getOrCreateExamId } from '@/lib/exam';
import { getTeacherIdsByNames } from '@/lib/teacher';
import { createTimetable } from '@/lib/timetable';
import type { RowDataPacket, PoolConnection } from 'mysql2/promise';

export async function POST(req: NextRequest) {
  let conn: PoolConnection | null = null;

  try {
    const body = await req.json();
    const {
      overwriteId,
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

    const teacherIds = await getTeacherIdsByNames(conn, teacher || []);
    const teacher_id_csv = teacherIds.join(',');

    // ดึงข้อมูลอาจารย์ทั้งหมดก่อนใช้งาน
    const [allTeachers] = await conn.query<RowDataPacket[]>(
      'SELECT teacher_id, role, teacherName, teacherSurname FROM Teacher'
    );

    // เรียงอาจารย์
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

    // ลบ timetable ที่จะ overwrite (ถ้ามี)
    const overwriteIdNum = Number(overwriteId);
    if (!isNaN(overwriteIdNum)) {
      console.log('🗑 ลบ timetable_id ที่ overwrite:', overwriteIdNum);
      await conn.query(`DELETE FROM Timetable WHERE timetable_id = ?`, [overwriteIdNum]);
    }

    // ตรวจสอบคาบซ้อน
    if (teacherIds.length > 0) {
      const placeholders = teacherIds.map(() => `FIND_IN_SET(?, REPLACE(t.teacher_id, ' ', '')) > 0`).join(' OR ');
      const [conflicts] = await conn.query<RowDataPacket[]>(
        `
        SELECT t.timetable_id, t.startTime, t.endTime, t.weekday, t.subject_id, t.teacher_id, t.location
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
          study.startTime, study.endTime,
        ]
      );

      if (conflicts.length > 0) {
        const conflictRow = conflicts[0];
        const conflictSubjectId = conflictRow.subject_id;
        let conflictSubjectName = conflictSubjectId;

        if (conflictSubjectId) {
          const [subjectRows] = await conn.query<RowDataPacket[]>(
            `SELECT subjectName FROM Subject WHERE subject_id = ?`,
            [conflictSubjectId]
          );
          conflictSubjectName = subjectRows[0]?.subjectName || conflictSubjectId;
        }

        const conflictingTeacherIdsSet = new Set<string>();
        conflicts.forEach((row) => {
          if (row.teacher_id) {
            row.teacher_id.split(',').forEach((id: string) => {
              if (teacherIds.includes(id.trim())) {
                conflictingTeacherIdsSet.add(id.trim());
              }
            });
          }
        });

        const conflictTeachers = Array.from(conflictingTeacherIdsSet).map((id) => {
          const t = allTeachers.find((x) => x.teacher_id === id);
          return t ? `${t.role}${t.teacherName} ${t.teacherSurname}` : id;
        });

        await conn.rollback();
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
              location: conflictRow.location ?? '',
            },
            teacher: conflictTeachers,
          },
        }, { status: 409 });
      }
    }

    // ตรวจสอบตารางเรียนซ้ำ (กรณีไม่มี overwrite)
    if (!overwriteIdNum || isNaN(overwriteIdNum)) {
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
          teacher_id_csv,
        ]
      );

      if (existing.length > 0) {
        await conn.rollback();
        return NextResponse.json({
          message: 'Timetable already exists',
          timetable_id: existing[0].timetable_id,
        }, { status: 200 });
      }
    }

   // สร้าง midterm_id หรือให้เป็น null ถ้าไม่มีข้อมูล
const midterm_id = exam?.midterm?.date
  ? await getOrCreateExamId(conn, { examType: 'midterm', ...exam.midterm })
  : null;

// สร้าง final_id หรือให้เป็น null ถ้าไม่มีข้อมูล
const final_id = exam?.final?.date
  ? await getOrCreateExamId(conn, { examType: 'final', ...exam.final })
  : null;

    // สร้างตารางเรียนใหม่
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
      teacherIds: sortedTeacherIds,
      midterm_id,
      final_id,
    });

    await conn.commit();
    return NextResponse.json({ message: 'Timetable created successfully' }, { status: 201 });

  } catch (error: any) {
    if (conn) await conn.rollback();
    console.error('POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create timetable' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
