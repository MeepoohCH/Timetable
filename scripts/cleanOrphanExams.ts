import { pool } from '../lib/db.ts';
import { ResultSetHeader } from 'mysql2/promise'; // ✅ เพิ่ม import นี้

async function cleanOrphanExams() {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query<ResultSetHeader>(
      `DELETE FROM Exam
       WHERE exam_id NOT IN (
         SELECT midterm_id FROM Timetable WHERE midterm_id IS NOT NULL
         UNION
         SELECT final_id FROM Timetable WHERE final_id IS NOT NULL
       )`
    );

    console.log(`✅ ลบข้อมูล Exam ที่ไม่ใช้งานแล้ว ${result.affectedRows} รายการ`);
  } catch (err) {
    console.error("❌ ลบไม่สำเร็จ:", err);
  } finally {
    conn.release();
    process.exit(0); // ✅ ปิดโปรเซสเมื่อเสร็จ
  }
}

cleanOrphanExams();
