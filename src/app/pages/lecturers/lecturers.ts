import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-lecturers',
  standalone: true,
  imports: [CommonModule, NzTableModule],
  templateUrl: './lecturers.html'
})
export class Lecturers {
  data = [{id:'L1', code:'CB001', fullName:'Nguyễn A', dept:'CNTT'}];
}
