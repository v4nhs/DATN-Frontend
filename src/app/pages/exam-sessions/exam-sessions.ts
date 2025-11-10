import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-exam-sessions',
  standalone: true,
  imports: [CommonModule, NzTableModule],
  templateUrl: './exam-sessions.html'
})
export class ExamSessions {
  data = [{id:'ES1', name:'Học kỳ 1 2024-2025', startDate:'2025-01-01', endDate:'2025-01-20'}];
}
