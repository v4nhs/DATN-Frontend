import { Component, ViewEncapsulation, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-assign',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    FormsModule,
    NzIconModule,
    NzButtonModule,
    NzGridModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule
  ],
  templateUrl: './assign.html',
  styleUrls: ['./assign.css'],
  encapsulation: ViewEncapsulation.None
})
export class Assign implements OnInit {

  private modal = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);

  // =============================
  // 1) DỮ LIỆU LỊCH THI (Schedule)
  // =============================
  scheduleList = [
    { id: 's1', courseCode: 'HP001', date: '2025-01-05', startTime: '07:30', roomName: 'A101' },
    { id: 's2', courseCode: 'HP002', date: '2025-01-06', startTime: '14:00', roomName: 'B201' }
  ];

  // =============================
  // 2) DANH SÁCH CÁN BỘ
  // =============================
  lecturers = [
    { fullName: "Nguyễn A", dept: "CNTT" },
    { fullName: "Trần B", dept: "CNTT" },
    { fullName: "Lê C", dept: "Toán" },
    { fullName: "Phạm D", dept: "Toán" }
  ];

  // =============================
  // 3) MAP phòng → khoa
  // =============================
  roomDeptMap: any = {
    "A101": "CNTT",
    "A102": "CNTT",
    "B201": "Toán",
    "B202": "Toán"
  };

  autoProctors: string[] = [];

  // =============================
  // 4) DỮ LIỆU PHÂN CÔNG
  // =============================
  searchInput: string = '';
  keyword: string = '';

  data = [
    { id: '1', slot: 'HP001 | 05/01 | 07:30 | A101', proctors: ['2'], supervisor: 'Lê C' }
  ];

  filteredData: (typeof this.data) = [];

  isVisible = false;
  isEditing = false;
  editingId: string | null = null;

  isView = false;
  isDetailVisible = false;
  detailData: any = null;

  assignmentForm = {
    slot: '',
    proctors: '',
    supervisor: ''
  };

  ngOnInit(): void {
    this.filterData();
  }

  // =============================
  // 5) CHỌN CA THI → TỰ ĐỘNG LOAD CÁN BỘ
  // =============================
  onSlotChange(scheduleId: string) {
    const slot = this.scheduleList.find(s => s.id === scheduleId);
    if (!slot) return;

    const room = slot.roomName;
    const dept = this.roomDeptMap[room];

    // Lấy cán bộ theo khoa
    this.autoProctors = this.lecturers
      .filter(l => l.dept === dept)
      .map(l => l.fullName);

    // Gán tự động vào form
    this.assignmentForm.proctors = this.autoProctors.join(", ");

    // Format slot để lưu
    this.assignmentForm.slot =
      `${slot.courseCode} | ${slot.date} | ${slot.startTime} | ${slot.roomName}`;
  }

  // =============================
  // 6) SEARCH 
  // =============================
  filterData(): void {
    if (!this.keyword) {
      this.filteredData = this.data;
    } else {
      const kw = this.keyword.toLowerCase();
      this.filteredData = this.data.filter(r =>
        r.slot.toLowerCase().includes(kw) ||
        r.supervisor.toLowerCase().includes(kw) ||
        r.proctors.join(', ').toLowerCase().includes(kw)
      );
    }
    this.cdr.markForCheck();
  }

  onSearch(): void {
    this.keyword = this.searchInput;
    this.filterData();
  }

  // =============================
  // 7) MODAL
  // =============================
  showAddModal(): void {
    this.isEditing = false;
    this.assignmentForm = { slot: '', proctors: '', supervisor: '' };
    this.isVisible = true;
  }

  showEditModal(row: any): void {
    this.isEditing = true;
    this.editingId = row.id;

    this.assignmentForm = {
      slot: row.slot,
      proctors: row.proctors.join(", "),
      supervisor: row.supervisor
    };

    this.isVisible = true;
  }

  showDetail(row: any): void {
    this.isView = true;
    this.detailData = row;
    this.isDetailVisible = true;

    // 1. Tách các phần từ slot
    const parts = row.slot.split(" | ");
    const courseCode = parts[0];
    const date = parts[1];
    const time = parts[2];
    const room = parts[3];

    // 2. Tìm trong scheduleList
    const schedule = this.scheduleList.find(s =>
      s.courseCode === courseCode &&
      s.date === date &&
      s.startTime === time &&
      s.roomName === room
    );

    // 3. Map dữ liệu chi tiết
    this.detailData = {
      ...schedule,
      proctors: row.proctors,
      supervisor: row.supervisor
    };


    this.isDetailVisible = true;
  }

  deleteAssignment(id: string): void {
    this.modal.confirm({
      nzTitle: 'Bạn có muốn xoá phân công?',
      nzOkDanger: true,
      nzOnOk: () => {
        this.data = this.data.filter(r => r.id !== id);
        this.filterData();
      }
    });
  }

  handleOk(): void {

    const proctorArray = this.assignmentForm.proctors
      .split(',')
      .map(x => x.trim())
      .filter(x => x.length > 0);

    if (this.isEditing && this.editingId) {

      const index = this.data.findIndex(r => r.id === this.editingId);
      this.data[index] = {
        id: this.editingId,
        slot: this.assignmentForm.slot,
        proctors: proctorArray,
        supervisor: this.assignmentForm.supervisor
      };

    } else {

      this.data.push({
        id: (this.data.length + 1).toString(),
        slot: this.assignmentForm.slot,
        proctors: proctorArray,
        supervisor: this.assignmentForm.supervisor
      });

    }

    this.isVisible = false;
    this.filterData();
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
