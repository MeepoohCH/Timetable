import { PoolConnection, RowDataPacket } from 'mysql2/promise';

export async function getTeacherIdsByNames(conn: PoolConnection, teacherNames: string[]): Promise<string[]> {
  const teacherIds: string[] = [];

  for (const fullName of teacherNames) {
    const parts = fullName.trim().split(' ');
    const name = parts[0];
    const surname = parts.slice(1).join(' ');

    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT teacher_id FROM Teacher WHERE teacherName = ? AND teacherSurname = ?`,
      [name, surname]
    );

    if (rows.length > 0) {
      const ids = rows.map(row => row.teacher_id as string);
      teacherIds.push(...ids);
    }
  }

  return teacherIds;
}
