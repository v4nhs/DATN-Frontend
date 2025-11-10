import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-payouts',
  standalone: true,
  imports: [CommonModule, NzTableModule],
  templateUrl: './payouts.html'
})
export class Payouts {
  data = [{lecturer:'Nguyễn A', period:'01/2025', amount:3200000, status:'draft'}];
}
