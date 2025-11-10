import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-assign',
  standalone: true,
  imports: [CommonModule, NzTableModule],
  templateUrl: './assign.html'
})
export class Assign {
  data = [{ slot: 'HP001 | 05/01 07:30 | A101', proctors: ['Nguyễn A', 'Trần B'], supervisor: 'Lê C' }];
}
