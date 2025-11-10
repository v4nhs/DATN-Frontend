import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';

type Role = 'proctor'|'supervisor';
interface Row { id:string; lecturer:string; role:Role; date:'weekday'|'weekend'; durationMin:number; }

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, NzTableModule, NzInputNumberModule, NzSelectModule, NzButtonModule],
  templateUrl: './payment.html',
})
export class Payment {
  // Quy tắc tạm (bạn đổi ở Settings và đọc sang đây qua service khi có backend)
  baseRate = signal(70000);               // VNĐ / ca tiêu chuẩn 60-90'
  supervisorMultiplier = signal(1.2);     // hệ số giám sát
  weekendBonus = signal(20000);           // cộng thêm cuối tuần
  overtimePer30Min = signal(15000);       // cộng mỗi 30' vượt 90'

  rows = signal<Row[]>([
    { id:'1', lecturer:'Nguyễn A', role:'proctor',    date:'weekday', durationMin:90 },
    { id:'2', lecturer:'Trần B',   role:'supervisor', date:'weekend', durationMin:120 },
  ]);

  calc(row: Row): number {
    const base = this.baseRate();
    const roleMul = row.role === 'supervisor' ? this.supervisorMultiplier() : 1;
    const weekend = row.date === 'weekend' ? this.weekendBonus() : 0;
    const overtime = Math.max(0, row.durationMin - 90);
    const steps = Math.ceil(overtime / 30);
    const overtimeMoney = steps > 0 ? steps * this.overtimePer30Min() : 0;
    return Math.round(base * roleMul + weekend + overtimeMoney);
  }

  total = computed(() => this.rows().reduce((sum, r) => sum + this.calc(r), 0));

  addRow(): void {
    const n = (this.rows().length + 1).toString();
    this.rows.update(list => [...list, { id:n, lecturer:`Giảng viên ${n}`, role:'proctor', date:'weekday', durationMin:90 }]);
  }
}
