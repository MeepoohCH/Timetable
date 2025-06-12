import { PoolConnection, RowDataPacket } from 'mysql2/promise';

type Exam = {
  date: string;
  startTime: string;
  endTime: string;
  location: string;
};

type StudySession = {
  startTime: string;
  endTime: string;
  location: string;
};

type TimetableInput = {
  subject_id: string;
  subjectType: string;
  yearLevel: number;
  degree: string;
  sec: string;
  semester: number;
  academicYear: string;
  weekday: string;
  study: StudySession;
  teacherIds: string[];
  midterm_id: number;
  final_id: number;
};

type TimetableUpdateInput = Partial<{ timetable_id: number }> & TimetableInput;

export async function createTimetable(conn: PoolConnection, data: TimetableInput): Promise<void> {
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
    teacherIds,
    midterm_id,
    final_id,
  } = data;

  const teacher_id_csv = teacherIds.join(',');

  await conn.query(
    `INSERT INTO Timetable 
      (subject_id, subjectType, yearLevel, degree, sec, semester, academicYear, weekday, startTime, endTime, location, midterm_id, final_id, teacher_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      midterm_id,
      final_id,
      teacher_id_csv
    ]
  );
}

export async function findTimetableIdByFields(
  conn: PoolConnection,
  data: Omit<TimetableInput, 'teacherIds' | 'midterm_id' | 'final_id'>
): Promise<number | undefined> {
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
  } = data;

  const [rows] = await conn.query<RowDataPacket[]>(
    `SELECT timetable_id FROM Timetable
     WHERE subject_id = ? AND subjectType = ? AND yearLevel = ? AND degree = ? AND sec = ?
       AND semester = ? AND academicYear = ? AND weekday = ? AND startTime = ? AND endTime = ? AND location = ?`,
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
    ]
  );

  if (rows.length === 0) return undefined;
  return rows[0].timetable_id as number;
}

export async function updateTimetable(conn: PoolConnection, data: TimetableUpdateInput): Promise<void> {
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
    teacherIds,
    midterm_id,
    final_id,
  } = data;

  // ✅ หาค่า timetable_id ถ้ายังไม่มี
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
      throw new Error('Timetable not found for update');
    }
  }

  const teacher_id_csv = teacherIds.join(',');

  await conn.query(
    `UPDATE Timetable SET 
      subject_id = ?, subjectType = ?, yearLevel = ?, degree = ?, sec = ?, semester = ?, academicYear = ?, weekday = ?, 
      startTime = ?, endTime = ?, location = ?, midterm_id = ?, final_id = ?, teacher_id = ?
     WHERE timetable_id = ?`,
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
      midterm_id,
      final_id,
      teacher_id_csv,
      timetable_id
    ]
  );
}

export async function deleteTimetable(
  conn: PoolConnection,
  input: { timetable_id?: number } & Omit<TimetableInput, 'teacherIds' | 'midterm_id' | 'final_id'>
): Promise<void> {
  let timetable_id = input.timetable_id;

  if (!timetable_id) {
    timetable_id = await findTimetableIdByFields(conn, input);

    if (!timetable_id) {
      throw new Error('Timetable not found for delete');
    }
  }

  await conn.query(
    `DELETE FROM Timetable WHERE timetable_id = ?`,
    [timetable_id]
  );
}
