import { div } from "framer-motion/client"

type Course = {
    subject: string
    subjectid: string
    subjecttype: string
    year: string
    sec: string
    credits: string
    teacher: string
    starttime: string
    endtime: string
}

export default function CourseCard({course} : {course:Course}) {
    return (
<div className="bg-gray-100 rounded-xl p-4 mb-5 shadow text-sm text-black max-w-xl">
  <div className="text-xl mb-2">{course.subject}</div>

  <div className="grid grid-cols-2 gap-x-10 gap-y-1 text-[#616161]">
    <div>{course.subjectid} ({course.subjecttype}) ปี {course.year} กลุ่ม {course.sec}</div>
    <div>เวลาเริ่ม {course.starttime}</div>
    <div>หน่วยกิต {course.credits}</div>
    <div>เวลาจบ {course.endtime}</div>
    <div>อาจารย์ {course.teacher}</div>
  </div>
</div>
    )
}