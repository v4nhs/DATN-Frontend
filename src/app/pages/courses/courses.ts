import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ExamSlot } from '../../models';


@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, NzTableModule, FormsModule, NzIconModule, NzButtonModule],
  templateUrl: './courses.html'
})
export class Courses {
  kw=''; data = [
    {id:'C1', code:'HP001', name:'Toán cao cấp', credits:3, action:''},
    {id:'C2', code:'HP002', name:'Vật lý', credits:3, action:''}
  ];
  get filtered(){ return this.data.filter(x => (x.code+x.name).toLowerCase().includes(this.kw.toLowerCase())); }
}
