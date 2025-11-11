import { Component, ViewEncapsulation, inject, OnInit, ChangeDetectorRef } from '@angular/core'; // ✅ 1. Thêm
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal'; // ✅ 2. Thêm
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

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
    NzInputModule],
  templateUrl: './assign.html',
  styleUrls: ['./assign.css'],
  encapsulation: ViewEncapsulation.None
})
export class Assign implements OnInit { // ✅ 3. Thêm
  // ✅ 4. Inject services
  private modal = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);

  // ✅ 5. Logic tìm kiếm
  searchInput: string = '';
  keyword: string = '';

  data = [{id: '1', slot: 'HP001 | 05/01 07:30 | A101', proctors: ['Nguyễn A', 'Trần B'], supervisor: 'Lê C' }];
  
  // ✅ 6. Dữ liệu hiển thị (đã lọc)
  filteredData: (typeof this.data) = [];
  
  // ✅ 7. Logic Form/Modal
  isVisible = false;
  isEditing = false;
  editingId: string | null = null;
  
  // ✅ 8. Đổi tên model
  assignmentForm = {
    slot: '',
    proctors: '', // Đây là string, sẽ được xử lý
    supervisor: ''
  };

  // ✅ 9. Gọi filterData() khi load
  ngOnInit(): void {
    this.filterData();
  }

  // ✅ 10. HÀM MỚI: Lọc dữ liệu thủ công
  filterData(): void {
    if (!this.keyword) {
      this.filteredData = this.data;
    } else {
      const kw = this.keyword.toLowerCase();
      this.filteredData = this.data.filter(r => 
        r.slot.toLowerCase().includes(kw) ||
        r.supervisor.toLowerCase().includes(kw) ||
        r.proctors.join(', ').toLowerCase().includes(kw) // Tìm kiếm bên trong mảng cán bộ
      );
    }
    // Buộc Angular cập nhật
    this.cdr.markForCheck();
  }

  // ✅ 11. HÀM MỚI: Tìm kiếm
  onSearch(): void {
    this.keyword = this.searchInput;
    this.filterData();
  }

  // ✅ 12. Đổi tên hàm (Thêm mới)
  showAddModal(): void {
    this.isEditing = false;
    this.editingId = null;
    this.isVisible = true;
    this.assignmentForm = {
      slot: '',
      proctors: '',
      supervisor: ''
    };
  }

  // ✅ 13. HÀM MỚI: Mở modal Sửa
  showEditModal(assignment: (typeof this.data)[0]): void {
    this.isEditing = true;
    this.editingId = assignment.id;
    this.isVisible = true;
    // Gán dữ liệu vào form
    this.assignmentForm = {
      slot: assignment.slot,
      proctors: assignment.proctors.join(', '), // CHUYỂN MẢNG THÀNH CHUỖI
      supervisor: assignment.supervisor
    };
  }

  // ✅ 14. HÀM MỚI: Xóa
  deleteAssignment(id: string): void {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc chắn muốn xóa phân công này?',
      nzContent: 'Hành động này sẽ xóa vĩnh viễn và không thể hoàn tác.',
      nzOkText: 'Xóa',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.data = this.data.filter(r => r.id !== id);
        this.filterData(); // Cập nhật lại bảng
      },
      nzCancelText: 'Hủy'
    });
  }

  // ✅ 15. Cập nhật hàm OK (cho cả Thêm và Sửa)
  handleOk(): void {
    if (!this.assignmentForm.slot || !this.assignmentForm.proctors || !this.assignmentForm.supervisor) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    // CHUYỂN CHUỖI (từ form) THÀNH MẢNG
    const proctorArray = this.assignmentForm.proctors
      .split(',') 
      .map(name => name.trim()) 
      .filter(name => name.length > 0);

    if (this.isEditing && this.editingId) {
      // --- LOGIC SỬA ---
      const index = this.data.findIndex(r => r.id === this.editingId);
      if (index !== -1) {
        this.data[index] = {
          id: this.data[index].id, // Giữ ID cũ
          slot: this.assignmentForm.slot,
          proctors: proctorArray, // Dùng mảng đã xử lý
          supervisor: this.assignmentForm.supervisor
        };
        this.data = [...this.data]; // Gán lại mảng
      }
    } else {
      // --- LOGIC THÊM MỚI ---
      this.data = [
        ...this.data,
        {
          id: (this.data.length + 1).toString(),
          slot: this.assignmentForm.slot,
          proctors: proctorArray, // Dùng mảng đã xử lý
          supervisor: this.assignmentForm.supervisor
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