import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ExamSlot } from '../../models';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, NzTableModule, NzFormModule, NzInputModule, NzDatePickerModule, NzButtonModule],
  templateUrl: './schedule.html',
  styleUrls: ['./schedule.css']
})
export class Schedule {
  keyword = '';
  slots = signal<ExamSlot[]>([
    { id:'1', courseId:'C1', courseCode:'HP001', courseName:'Toán cao cấp', date:'2025-01-05', startTime:'07:30', durationMin:90, roomId:'R1', roomName:'A101', proctorsNeeded:2 },
    { id:'2', courseId:'C2', courseCode:'HP002', courseName:'Vật lý',      date:'2025-01-05', startTime:'09:30', durationMin:60, roomId:'R2', roomName:'A102', proctorsNeeded:2 },
    { id:'3', courseId:'C3', courseCode:'HP003', courseName:'CSDL',         date:'2025-01-06', startTime:'13:30', durationMin:120,roomId:'R3', roomName:'B201', proctorsNeeded:3 },
  ]);

  filtered = computed(() =>
    this.slots().filter(s =>
      (this.keyword || '').toLowerCase().split(' ')
        .every(k => [s.courseCode, s.courseName, s.roomName].join(' ').toLowerCase().includes(k))
    )
  );

  addQuick(): void {
    const n = (this.slots().length + 1).toString();
    // this.slots.update(list => [...list, {
    //   id:n, courseId:`C${n}`, courseCode:`HP${n.padStart(3,'0')}`, courseName:`Học phần ${n}`,
    //   date:'2025-01-07', startTime:'07:30', durationMin:90, roomId:'R1', roomName:'A101', proctorsNeeded:2
    // }]);
  }
}
