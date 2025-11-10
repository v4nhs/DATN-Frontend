export interface Course { id: string; code: string; name: string; credits?: number; }
export interface Room { id: string; name: string; capacity: number; building?: string; }
export interface Lecturer { id: string; code: string; fullName: string; phone?: string; dept?: string; }
export interface ExamSession { id: string; name: string; startDate: string; endDate: string; note?: string; }
export interface ExamSlot {
  id: string; courseId: string; courseCode: string; courseName: string;
  date: string; startTime: string; durationMin: number; roomId: string; roomName: string;
  proctorsNeeded: number; note?: string;
}
export interface Assignment {
  id: string; slotId: string; lecturerId: string; role: 'proctor'|'supervisor';
}
export interface PaymentRule {
  baseRate: number; // VNĐ/ca
  supervisorMultiplier: number; // hệ số giám sát
  weekendBonus: number; // cộng VNĐ nếu thi T7/CN
  overtimePer30Min: number; // cộng VNĐ mỗi 30'
}
export interface Payout { id: string; lecturerId: string; period: string; amount: number; status: 'draft'|'approved'|'paid'; }
