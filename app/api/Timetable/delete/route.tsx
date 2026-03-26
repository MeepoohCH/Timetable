// app/api/Timetable/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from '../../../../lib/db';

import { ResultSetHeader } from "mysql2";

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { timetable_id } = body;
     console.log('delete timetable:', body);

    if (!timetable_id) {
      return NextResponse.json(
        { message: "timetable_id ต้องระบุ" },
        { status: 400 }
      );
    }

    const conn = await pool.getConnection();

    try {
      const [result] = await conn.query<ResultSetHeader>(
        "DELETE FROM Timetable WHERE timetable_id = ?",
        [timetable_id]
      );

      conn.release();

      if (result.affectedRows === 0) {
        return NextResponse.json(
          { message: "ไม่พบข้อมูลที่ต้องการลบ" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "ลบข้อมูลสำเร็จ" },
        { status: 200 }
      );
    } catch (error) {
      conn.release();
      console.error("Error deleting timetable:", error);
      return NextResponse.json(
        { message: "เกิดข้อผิดพลาดในการลบข้อมูล" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Invalid JSON:", error);
    return NextResponse.json(
      { message: "ข้อมูลที่ส่งมาไม่ถูกต้อง" },
      { status: 400 }
    );
  }
}
