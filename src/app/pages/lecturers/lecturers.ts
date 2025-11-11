import { Component, ViewEncapsulation, inject, OnInit, ChangeDetectorRef } from '@angular/core'; // ✅ 1. Thêm
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal'; // ✅ 2. Thêm
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-lecturers',
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
    NzInputModule
  ],
  templateUrl: './lecturers.html',
  styleUrl: './lecturers.css',
  encapsulation: ViewEncapsulation.None
})
export class Lecturers implements OnInit { // ✅ 3. Implement OnInit
  // ✅ 4. Inject services
  private modal = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);

  // ✅ 5. Logic tìm kiếm
  searchInput: string = ''; // Dùng cho ô input
  keyword: string = '';     // Dùng để lọc

  data = [{ id: 'L1', code: 'CB001', fullName: 'Nguyễn A', dept: 'CNTT' }];

  // ✅ 6. THAY THẾ 'get filteredData()'
  filteredData: (typeof this.data) = [];

  // ✅ 7. Logic Form/Modal
  isVisible = false;
  isEditing = false;
  editingId: string | null = null;
  
  // ✅ 8. Đổi tên model
  lecturerForm = {
    code: '',
    fullName: '',
    dept: ''
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
      // Lọc theo Mã CB hoặc Họ tên
      this.filteredData = this.data.filter(t =>
        (t.code + t.fullName).toLowerCase().includes(kw)
      );
    }
    // Buộc Angular cập nhật
    this.cdr.markForCheck();
  }

  // ✅ 11. HÀM MỚI: Tìm kiếm
  onSearch(): void {
    this.keyword = this.searchInput; // Cập nhật keyword
    this.filterData(); // Gọi lọc thủ công
  }

  // ✅ 12. Đổi tên hàm (Thêm mới)
  showAddModal(): void {
    this.isEditing = false;
    this.editingId = null;
    this.isVisible = true;
    this.lecturerForm = {
      code: '',
      fullName: '',
      dept: ''
    };
  }

  // ✅ 13. HÀM MỚI: Mở modal Sửa
  showEditModal(lecturer: (typeof this.data)[0]): void {
    this.isEditing = true;
    this.editingId = lecturer.id;
    this.isVisible = true;
    // Copy dữ liệu vào form
    this.lecturerForm = { ...lecturer };
  }

  // ✅ 14. HÀM MỚI: Xóa
  deleteLecturer(id: string): void {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc chắn muốn xóa cán bộ này?',
      nzContent: 'Hành động này sẽ xóa vĩnh viễn và không thể hoàn tác.',
      nzOkText: 'Xóa',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.data = this.data.filter(l => l.id !== id);
        this.filterData(); // Cập nhật lại bảng
      },
      nzCancelText: 'Hủy'
    });
  }

  // ✅ 15. Cập nhật hàm OK (cho cả Thêm và Sửa)
  handleOk(): void {
    if (!this.lecturerForm.code || !this.lecturerForm.fullName) {
      alert('Vui lòng nhập Mã và Họ tên cán bộ!');
      return;
    }

    if (this.isEditing && this.editingId) {
      // --- LOGIC SỬA ---
      const index = this.data.findIndex(l => l.id === this.editingId);
      if (index !== -1) {
        // Cập nhật dữ liệu
        this.data[index] = {
          id: this.data[index].id, // Giữ lại ID
          code: this.lecturerForm.code,
          fullName: this.lecturerForm.fullName,
          dept: this.lecturerForm.dept
        };
        this.data = [...this.data]; // Gán lại mảng
      }
    } else {
      // --- LOGIC THÊM MỚI (Đã đúng) ---
      this.data = [
        ...this.data,
        {
          id: `L${this.data.length + 1}`,
          ...this.lecturerForm
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