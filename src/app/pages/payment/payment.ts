import { Component, signal, computed, inject, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

type Role = 'proctor' | 'supervisor';
interface Row { id: string; lecturer: string; role: Role; date: 'weekday' | 'weekend'; durationMin: number; }

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzInputNumberModule,
    NzSelectModule,
    NzButtonModule,
    NzIconModule,
    NzGridModule,
    NzModalModule,
    NzFormModule,
    NzInputModule
  ],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
  encapsulation: ViewEncapsulation.None
})
export class Payment {

  // ================================
  //     QUY TẮC TẠM DEMO
  // ================================
  baseRate = signal(70000);               
  supervisorMultiplier = signal(1.2);    
  weekendBonus = signal(20000);          
  overtimePer30Min = signal(15000);       

  rows = signal<Row[]>([
    { id: '1', lecturer: 'Nguyễn A', role: 'proctor', date: 'weekday', durationMin: 90 },
    { id: '2', lecturer: 'Trần B', role: 'supervisor', date: 'weekend', durationMin: 120 },
  ]);

  // ===================================
  // 🔥 FORM TÍNH TIỀN
  // ===================================
  examForm = {
    sessions: 1,         // số ca
    type: 'viet',        // viet | khac
    studentCount: 0      // chỉ dùng nếu khác
  };

  totalAmount = 0;

  calculateAmount() {
    if (this.examForm.type === 'viet') {
      this.totalAmount = this.examForm.sessions * 60000;   // thi viết
    } else {
      this.totalAmount = this.examForm.studentCount * 9000; // hình thức khác
    }
  }

  // ===================================
  //  TÍNH TIỀN TỰ ĐỘNG MỖI 200ms
  // ===================================
  watchFormChanges() {
    setInterval(() => this.calculateAmount(), 200);
  }

  // ===================================
  // TÍNH TIỀN DS GIÁM THỊ / GIẢNG VIÊN
  // ===================================
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
    this.rows.update(list => [
      ...list,
      {
        id: n,
        lecturer: `Giảng viên ${n}`,
        role: 'proctor',
        date: 'weekday',
        durationMin: 90
      }
    ]);
  }

  private modal = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);

  // ===================================
  //     TÌM KIẾM GIẢNG VIÊN
  // ===================================
  searchInput: string = '';
  keyword: string = '';

  data = [
    { id: 'L1', code: 'CB001', fullName: 'Nguyễn A', dept: 'CNTT' }
  ];

  filteredData: (typeof this.data) = [];

  lecturerForm = {
    code: '',
    fullName: '',
    dept: ''
  };

  // ============================
  // ⚡ HÀM LỌC DỮ LIỆU
  // ============================
  filterData(): void {
    if (!this.keyword) {
      this.filteredData = this.data;
    } else {
      const kw = this.keyword.toLowerCase();
      this.filteredData = this.data.filter(t =>
        (t.code + t.fullName).toLowerCase().includes(kw)
      );
    }
    this.cdr.markForCheck();
  }

  onSearch(): void {
    this.keyword = this.searchInput;
    this.filterData();
  }

  // ================================
  //        MODAL XỬ LÝ
  // ================================
  isVisible = false;
  isEditing = false;
  editingId: string | null = null;

  handleOk() {
    this.calculateAmount();
    console.log("Tổng tiền:", this.totalAmount);
    this.isVisible = false;
  }

  handleCancel() {
    this.isVisible = false;
  }

  // ================================
  //   KHỞI TẠO (CHỈ DUY NHẤT 1 LẦN)
  // ================================
  ngOnInit(): void {
    this.filterData();
    this.watchFormChanges();
  }
}
