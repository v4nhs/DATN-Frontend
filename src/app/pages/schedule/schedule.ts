import { Component, ViewEncapsulation, inject, OnInit, ChangeDetectorRef } from '@angular/core'; // ✅ Thêm inject, OnInit, ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal'; // ✅ Thêm NzModalService

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule],
  templateUrl: './schedule.html',
  styleUrls: ['./schedule.css'],
  encapsulation: ViewEncapsulation.None,
})
export class Schedule implements OnInit { // ✅ Implement OnInit
  // ✅ Inject services
  private modal = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);

  // ✅ Logic tìm kiếm
  searchInput: string = '';
  keyword: string = '';

  // Dữ liệu mẫu (nguồn)
  data = [
    {
      id: '1',
      courseCode: 'HP001',
      courseName: 'Toán cao cấp',
      date: '2025-01-05',
      startTime: '07:30',
      durationMin: 90,
      roomName: 'A101',
      proctorsNeeded: 2
    },
    {
      id: '2',
      courseCode: 'HP002',
      courseName: 'Vật lý',
      date: '2025-01-05',
      startTime: '09:30',
      durationMin: 60,
      roomName: 'A102',
      proctorsNeeded: 2
    }
  ];

  // ✅ Dữ liệu hiển thị (đã lọc)
  filteredData: (typeof this.data) = [];

  // ✅ Logic Form/Modal
  isVisible = false;
  isEditing = false;
  editingId: string | null = null;
  
  // ✅ Đổi tên form model
  scheduleForm = {
    courseCode: '',
    courseName: '',
    date: '',
    startTime: '',
    durationMin: 90,
    roomName: '',
    proctorsNeeded: 2
  };

  // ✅ Gọi filterData() khi load
  ngOnInit(): void {
    this.filterData();
  }

  // ✅ HÀM MỚI: Lọc dữ liệu thủ công
  filterData(): void {
    if (!this.keyword) {
      this.filteredData = this.data;
    } else {
      const kw = this.keyword.toLowerCase();
      // Lọc theo Mã HP, Tên HP, hoặc Phòng
      this.filteredData = this.data.filter(s => 
        s.courseCode.toLowerCase().includes(kw) ||
        s.courseName.toLowerCase().includes(kw) ||
        s.roomName.toLowerCase().includes(kw)
      );
    }
    // Buộc Angular cập nhật
    this.cdr.markForCheck();
  }

  // ✅ HÀM MỚI: Tìm kiếm
  onSearch(): void {
    this.keyword = this.searchInput;
    this.filterData();
  }

  // ✅ Đổi tên hàm (Thêm mới)
  showAddModal(): void {
    this.isEditing = false;
    this.editingId = null;
    this.isVisible = true;
    // Reset form
    this.scheduleForm = {
      courseCode: '',
      courseName: '',
      date: '',
      startTime: '',
      durationMin: 90,
      roomName: '',
      proctorsNeeded: 2
    };
  }

  // ✅ HÀM MỚI: Mở modal Sửa
  showEditModal(schedule: (typeof this.data)[0]): void {
    this.isEditing = true;
    this.editingId = schedule.id;
    this.isVisible = true;
    // Copy dữ liệu (trừ id) vào form
    this.scheduleForm = {
      courseCode: schedule.courseCode,
      courseName: schedule.courseName,
      date: schedule.date,
      startTime: schedule.startTime,
      durationMin: schedule.durationMin,
      roomName: schedule.roomName,
      proctorsNeeded: schedule.proctorsNeeded
    };
  }

  // ✅ HÀM MỚI: Xóa
  deleteSchedule(id: string): void {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc chắn muốn xóa lịch thi này?',
      nzContent: 'Hành động này sẽ xóa vĩnh viễn và không thể hoàn tác.',
      nzOkText: 'Xóa',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.data = this.data.filter(s => s.id !== id);
        this.filterData(); // Cập nhật lại bảng
      },
      nzCancelText: 'Hủy'
    });
  }

  // ✅ Cập nhật hàm OK (cho cả Thêm và Sửa)
  handleOk(): void {
    if (!this.scheduleForm.courseCode || !this.scheduleForm.date || !this.scheduleForm.startTime) {
      alert('Vui lòng nhập Mã HP, Ngày và Giờ!');
      return;
    }

    if (this.isEditing && this.editingId) {
      // --- LOGIC SỬA ---
      const index = this.data.findIndex(s => s.id === this.editingId);
      if (index !== -1) {
        // Giữ lại ID cũ, cập nhật các trường khác từ form
        this.data[index] = {
          id: this.data[index].id, 
          ...this.scheduleForm 
        };
        this.data = [...this.data]; // Gán lại mảng
      }
    } else {
      // --- LOGIC THÊM MỚI (Đã đúng) ---
      this.data = [
        ...this.data,
        {
          id: (this.data.length + 1).toString(),
          ...this.scheduleForm
        }
      ];
    }

    this.isVisible = false;
    this.isEditing = false;
    this.editingId = null;
    this.filterData(); // Cập nhật lại bảng
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isEditing = false;
    this.editingId = null;
  }
}