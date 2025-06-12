// lib/subject.ts
import { PoolConnection, RowDataPacket } from 'mysql2/promise';

export async function getSubjectNameById(conn: PoolConnection, subject_id: string): Promise<string | null> {
  const [rows] = await conn.query<RowDataPacket[]>(
    `SELECT subjectName FROM Subject WHERE subject_id = ?`,
    [subject_id]
  );

  if (rows.length === 0) return null;

  return rows[0].subjectName as string;
}
