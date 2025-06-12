// utils/timetableAddHandlers.ts

// Type ของตารางเรียน (สามารถปรับตาม schema จริงของคุณได้)
export interface TimetableItem {
  id: string;
  subject_id: string;
  subjectType: string;
  yearLevel: string;
  degree: string;
  sec: string;
  semester: string;
  academicYear: string;
  weekday: string;
  startTime: string;
  endTime: string;
  location: string;
  exam_id: string;
  teacher_id: string;
}

// ดึงข้อมูล timetable ทั้งหมด
export const fetchTimetable = async (
  setTimetableData: (data: TimetableItem[]) => void,
  setFetchingData: (status: boolean) => void
): Promise<void> => {
  setFetchingData(true);
  try {
    const response = await fetch('/api/timetable');
    if (response.ok) {
      const data: TimetableItem[] = await response.json();
      setTimetableData(data);
    }
  } catch (error) {
    console.error('Error fetching timetable:', error);
  } finally {
    setFetchingData(false);
  }
};

// จัดการ input form
export const handleInputChange = (
  setFormData: React.Dispatch<React.SetStateAction<TimetableItem>>
) => (field: keyof TimetableItem, value: string): void => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));
};

// ส่งข้อมูลฟอร์ม
export const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>,
  formData: TimetableItem,
  setLoading: (status: boolean) => void,
  setFormData: React.Dispatch<React.SetStateAction<TimetableItem>>,
  fetchTimetableCallback: () => void
): Promise<void> => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await fetch('/api/timetable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert('บันทึกตารางเรียนสำเร็จ! 🎉');
      // รีเซ็ตฟอร์ม
      setFormData({
        id: '',
        subject_id: '',
        subjectType: '',
        yearLevel: '',
        degree: '',
        sec: '',
        semester: '',
        academicYear: '',
        weekday: '',
        startTime: '',
        endTime: '',
        location: '',
        exam_id: '',
        teacher_id: '',
      });
      fetchTimetableCallback();
    } else {
      const errorData = await response.json();
      alert('เกิดข้อผิดพลาด: ' + errorData.error);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
  } finally {
    setLoading(false);
  }
};
