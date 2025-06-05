// app/api/timetable/route.ts
import { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const connection = await connectDB(); // ต้องเรียก function ก่อนถึงจะได้ connection
    const [rows] = await connection.query('SELECT * FROM Timetable');

    return NextResponse.json(rows);
  } catch (error) {
    console.error('❌ Error fetching timetable:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timetable' },
      { status: 500 }
    );
  }
}
