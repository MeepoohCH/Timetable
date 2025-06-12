import { PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export async function getOrCreateExamId(conn: PoolConnection, exam: {
  examType: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
}): Promise<number> {
  const [existing] = await conn.query<RowDataPacket[]>(
    `SELECT exam_id FROM Exam WHERE examType = ? AND date = ? AND startTime = ? AND endTime = ? AND location = ?`,
    [exam.examType, exam.date, exam.startTime, exam.endTime, exam.location]
  );

  if (existing.length > 0) return existing[0].exam_id;

  const [insertResult] = await conn.query<ResultSetHeader>(
    `INSERT INTO Exam (examType, date, startTime, endTime, location) VALUES (?, ?, ?, ?, ?)`,
    [exam.examType, exam.date, exam.startTime, exam.endTime, exam.location]
  );

  return insertResult.insertId;
}
