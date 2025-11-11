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
  selector: 'app-courses',
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
  templateUrl: './courses.html',
  styleUrl: './courses.css',
  encapsulation: ViewEncapsulation.None
})
export class Courses implements OnInit { // ✅ 3. Implement OnInit
  // ✅ 4. Inject services
  private modal = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);

  // ✅ 5. Logic tìm kiếm (dọn dẹp 'kw' và 'keyword')
  searchInput: string = ''; // Dùng cho ô input
  keyword: string = ''; // Dùng để lọc

  data = [
    {id:'C1', code:'HP001', name:'Toán cao cấp', credits:3, action:''},
    {id:'C2', code:'HP002', name:'Vật lý', credits:3, action:''}
  ];

  // ✅ 6. THAY THẾ 'get filtered()'
  filteredData: (typeof this.data) = [];

  // ✅ 7. Logic Form/Modal
  isVisible = false;
  isEditing = false;
  editingId: string | null = null;
  
  // ✅ 8. Đổi tên model
  courseForm = {
    code: '',
    name: '',
    credits: 3 
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
      // Lọc theo Mã HP hoặc Tên HP
      this.filteredData = this.data.filter(x => 
        (x.code + x.name).toLowerCase().includes(kw)
      );
    }
    // Buộc Angular cập nhật
    this.cdr.markForCheck();
  }

  // ✅ 11. Cập nhật hàm tìm kiếm
  onSearch(): void {
    this.keyword = this.searchInput; // Cập nhật keyword
    this.filterData(); // Gọi lọc thủ công
  }

  // ✅ 12. Đổi tên hàm (Thêm mới)
  showAddModal(): void {
    this.isEditing = false;
    this.editingId = null;
    this.isVisible = true;
    this.courseForm = {
      code: '',
      name: '',
      credits: 3
    };
  }

  // ✅ 13. HÀM MỚI: Mở modal Sửa
  showEditModal(course: (typeof this.data)[0]): void {
    this.isEditing = true;
    this.editingId = course.id;
    this.isVisible = true;
    // Copy dữ liệu vào form
    this.courseForm = {
      code: course.code,
      name: course.name,
      credits: course.credits
    };
  }

  // ✅ 14. HÀM MỚI: Xóa
  deleteCourse(id: string): void {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc chắn muốn xóa học phần này?',
      nzContent: 'Hành động này sẽ xóa vĩnh viễn và không thể hoàn tác.',
      nzOkText: 'Xóa',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.data = this.data.filter(c => c.id !== id);
        this.filterData(); // Cập nhật lại bảng
      },
      nzCancelText: 'Hủy'
    });
  }

  // ✅ 15. Cập nhật hàm OK (cho cả Thêm và Sửa)
  handleOk(): void {
    if (!this.courseForm.code || !this.courseForm.name) {
      alert('Vui lòng nhập Mã và Tên học phần!');
      return;
    }

    if (this.isEditing && this.editingId) {
      // --- LOGIC SỬA ---
      const index = this.data.findIndex(c => c.id === this.editingId);
      if (index !== -1) {
        // Cập nhật dữ liệu tại vị trí đó
        this.data[index] = {
          ...this.data[index], // Giữ lại 'id' và 'action'
          code: this.courseForm.code,
          name: this.courseForm.name,
          credits: this.courseForm.credits
        };
        this.data = [...this.data]; // Gán lại mảng
      }
    } else {
      // --- LOGIC THÊM MỚI (Đã đúng) ---
      this.data = [
        ...this.data,
        {
          id: `C${this.data.length + 1}`,
          ...this.courseForm,
          action: '' 
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