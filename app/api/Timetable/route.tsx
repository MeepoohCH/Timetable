import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { getOrCreateExamId } from '@/lib/exam';
import { getTeacherIdsByNames } from '@/lib/teacher';
import { createTimetable, updateTimetable, deleteTimetable, findTimetableIdByFields } from '@/lib/timetable';
import { RowDataPacket } from 'mysql2/promise';
import { getSubjectNameById } from '@/lib/subject'; 

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

    const subjectName = await getSubjectNameById(conn, subject_id);
    if (!subjectName) {
      const url = new URL('/SubjectData', req.url);  // สร้าง absolute URL
      url.searchParams.set('error', 'Subject not found'); // ส่งข้อความผ่าน query string

      return NextResponse.redirect(url.toString(), 302);
    }

    
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

    // ถ้า timetable_id ไม่มีจาก body, ให้หาโดยใช้ข้อมูลอื่น ๆ
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

    const teacherIds = await getTeacherIdsByNames(conn, teacher || []);
    console.log('Teacher IDs:', teacherIds);

    const midterm_id = await getOrCreateExamId(conn, {
      examType: 'midterm',
      date: exam.midterm.date,
      startTime: exam.midterm.startTime,
      endTime: exam.midterm.endTime,
      location: exam.midterm.location,
    });
    console.log('Midterm exam ID:', midterm_id);

    const final_id = await getOrCreateExamId(conn, {
      examType: 'final',
      date: exam.final.date,
      startTime: exam.final.startTime,
      endTime: exam.final.endTime,
      location: exam.final.location,
    });
    console.log('Final exam ID:', final_id);

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

export async function DELETE(req: NextRequest) {
  let conn = null;

  try {
    const body = await req.json();
    console.log('Deleting timetable with body:', body);

    let { timetable_id } = body;

    conn = await pool.getConnection();

    // ถ้า timetable_id ไม่มีจาก body, ให้หาโดยใช้ข้อมูลอื่น ๆ (สมมติว่ารับข้อมูลอื่นมาด้วย)
    if (!timetable_id) {
      console.log('No timetable_id provided for delete, searching by other fields...');
      // สมมติว่า front-end ส่งข้อมูลอื่นมาด้วยสำหรับลบ เช่นเดียวกับ PUT
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
      } = body;

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
        console.log('Timetable ID not found for delete.');
        return NextResponse.json({ error: 'Timetable ID not found for delete' }, { status: 404 });
      }
      console.log('Found timetable_id:', timetable_id);
    }

    await deleteTimetable(conn, timetable_id);
    console.log('Timetable deleted.');

    return NextResponse.json({ message: 'Timetable deleted successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete timetable' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}

export async function GET(req: NextRequest) {
  let conn = null;

  try {
    const url = new URL(req.url);
    const timetableIdRaw = url.searchParams.get('timetable_id');

    if (!timetableIdRaw) {
      return NextResponse.json({ error: 'Missing timetable_id' }, { status: 400 });
    }

    const timetable_id = Number(timetableIdRaw);
    if (isNaN(timetable_id)) {
      return NextResponse.json({ error: 'Invalid timetable_id format' }, { status: 400 });
    }

    conn = await pool.getConnection();

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

    return NextResponse.json(rows[0]);

  } catch (error: any) {
    console.error('GET timetable error:', error);
    return NextResponse.json({ error: error.message || 'Failed to get timetable' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
