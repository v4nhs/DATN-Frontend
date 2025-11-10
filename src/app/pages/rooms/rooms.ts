import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, NzTableModule],
  templateUrl: './rooms.html'
})
export class Rooms {
  data = [{id:'R1', name:'A101', capacity:50}, {id:'R2', name:'A102', capacity:60}];
}
