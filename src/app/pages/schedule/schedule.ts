import {
  Component,
  ViewEncapsulation,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzSelectModule,
    NzTabsModule
  ],
  templateUrl: './schedule.html',
  styleUrls: ['./schedule.css'],
  encapsulation: ViewEncapsulation.None
})
export class Schedule implements OnInit {

  private modal = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);

  // ===========================
  // SEARCH + FILTER
  // ===========================
  searchInput: string = '';
  keyword: string = '';
  selectedBatchFilter: string | null = null;
  selectedBatchTabIndex = 0;

  // ===========================
  // DỮ LIỆU ĐỢT THI
  // ===========================
  examBatches = [
    {
      batchId: '1',
      batchName: 'Đợt 1 HK2 2025',
      startDate: '2025-01-01',
      endDate: '2025-01-10'
    }
  ];

  // FORM ĐỢT THI
  isBatchVisible = false;
  isEditingBatch = false;
  editingBatchId: string | null = null;

  // ❗ batchForm phải chứa batchId để edit không lỗi
  batchForm = {
    batchId: '',
    batchName: '',
    startDate: '',
    endDate: ''
  };

  // ===========================
  // DỮ LIỆU LỊCH THI
  // ===========================
  data = [
    {
      id: '1',
      batchId: '1',
      courseCode: 'HP001',
      courseName: 'Toán cao cấp',
      date: '2025-01-05',
      examTime: '10h00 - 12h00',
      proctorsNeeded: 2,
      note: ''
    },
    {
      id: '2',
      batchId: '1',
      courseCode: 'HP002',
      courseName: 'Nguyên lý cơ bản',
      date: '2025-01-06',
      examTime: '07h30 - 09h30',
      proctorsNeeded: 2,
      note: ''
    }
  ];

  filteredData: any[] = [];

  // FORM lịch thi
  isVisible = false;
  isEditing = false;
  editingId: string | null = null;

  scheduleForm = {
    batchId: '',
    courseCode: '',
    courseName: '',
    date: '',
    startHour: '',
    endHour: '',
    proctorsNeeded: 2,
    note: ''
  };

  ngOnInit(): void {
    this.filterData();
  }

  // ===========================
  // FILTER DATA
  // ===========================
  filterData() {
    let list = [...this.data];

    if (this.selectedBatchFilter) {
      list = list.filter(s => s.batchId === this.selectedBatchFilter);
    }

    if (this.keyword.trim() !== '') {
      const kw = this.keyword.toLowerCase();
      list = list.filter(s =>
        s.courseCode.toLowerCase().includes(kw) ||
        s.courseName.toLowerCase().includes(kw)
      );
    }

    this.filteredData = list;
    this.cdr.markForCheck();
  }

  onSearch() {
    this.keyword = this.searchInput.trim();
    this.filterData();
  }

  onBatchTabChange(index: number) {
    this.selectedBatchTabIndex = index;
    const batch = this.examBatches[index];
    this.selectedBatchFilter = batch.batchId;
    this.filterData();
  }

  getSchedulesByBatch(batchId: string) {
    return this.filteredData.filter(s => s.batchId === batchId);
  }

  exportExcel() {
    console.log("Export Excel clicked!");
  }

  // ===========================
  // TẠO ĐỢT THI
  // ===========================
  showBatchModal() {
    this.isBatchVisible = true;
    this.isEditingBatch = false;
    this.batchForm = {
      batchId: '',
      batchName: '',
      startDate: '',
      endDate: ''
    };
  }

  editBatch(batch: any) {
    this.isEditingBatch = true;
    this.editingBatchId = batch.batchId;

    this.batchForm = {
      batchId: batch.batchId,
      batchName: batch.batchName,
      startDate: batch.startDate,
      endDate: batch.endDate
    };

    this.isBatchVisible = true;
  }

  handleBatchOk() {
    if (!this.batchForm.batchName || !this.batchForm.startDate || !this.batchForm.endDate) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (this.isEditingBatch && this.editingBatchId) {
      const idx = this.examBatches.findIndex(b => b.batchId === this.editingBatchId);
      if (idx !== -1) {
        this.examBatches[idx] = { ...this.batchForm };
      }
    } else {
      this.examBatches.push({
        ...this.batchForm,
        batchId: (this.examBatches.length + 1).toString()
      });
    }

    this.isBatchVisible = false;
  }

  deleteBatch(batchId: string) {
    this.modal.confirm({
      nzTitle: 'Xóa đợt thi?',
      nzOkDanger: true,
      nzOnOk: () => {
        this.examBatches = this.examBatches.filter(b => b.batchId !== batchId);
        this.data = this.data.filter(s => s.batchId !== batchId);
        this.filterData();
      }
    });
  }

  handleBatchCancel() {
    this.isBatchVisible = false;
  }

  // ===========================
  // LỊCH THI
  // ===========================
  showAddModal(batchId?: string) {
    this.isVisible = true;
    this.isEditing = false;

    this.scheduleForm = {
      batchId: batchId || '',
      courseCode: '',
      courseName: '',
      date: '',
      startHour: '',
      endHour: '',
      proctorsNeeded: 2,
      note: ''
    };
  }

  showEditModal(s: any) {
    this.isVisible = true;
    this.isEditing = true;
    this.editingId = s.id;

    const [start, end] = s.examTime
      .split('-')
      .map((x: string) => x.trim());

    this.scheduleForm = {
      batchId: s.batchId,
      courseCode: s.courseCode,
      courseName: s.courseName,
      date: s.date,
      startHour: start.replace('h', ':'),
      endHour: end.replace('h', ':'),
      proctorsNeeded: s.proctorsNeeded,
      note: s.note
    };
  }

  convertToExamFormat(time: string): string {
    const [h, m] = time.split(':');
    return `${h}h${m}`;
  }

  handleOk() {
    const examTime =
      `${this.convertToExamFormat(this.scheduleForm.startHour)} - ${this.convertToExamFormat(this.scheduleForm.endHour)}`;

    if (this.isEditing && this.editingId) {
      const idx = this.data.findIndex(x => x.id === this.editingId);
      this.data[idx] = {
        id: this.editingId,
        ...this.scheduleForm,
        examTime
      };
    } else {
      this.data.push({
        id: (this.data.length + 1).toString(),
        ...this.scheduleForm,
        examTime
      });
    }

    this.isVisible = false;
    this.filterData();
  }

  deleteSchedule(id: string) {
    this.modal.confirm({
      nzTitle: 'Xóa lịch thi?',
      nzOnOk: () => {
        this.data = this.data.filter(x => x.id !== id);
        this.filterData();
      }
    });
  }

  handleCancel() {
    this.isVisible = false;
  }
}
