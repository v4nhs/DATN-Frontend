import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, NzInputNumberModule, NzButtonModule],
  templateUrl: './settings.html'
})
export class Settings {
  baseRate = 70000;
  supervisorMultiplier = 1.2;
  weekendBonus = 20000;
  overtimePer30Min = 15000;

  save(){ /* TODO: gọi API lưu */ }
}
