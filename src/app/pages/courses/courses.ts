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
export class Courses implements OnInit {
  private modal = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);

  searchInput: string = '';
  keyword: string = '';

  data = [
    {id:'C1', code:'HP001', name:'Toán cao cấp', credits:3, action:''},
    {id:'C2', code:'HP002', name:'Vật lý', credits:3, action:''}
  ];

  filteredData: (typeof this.data) = [];

  isVisible = false;
  isEditing = false;
  editingId: string | null = null;
 
  courseForm = {
    code: '',
    name: '',
    credits: 3 
  };

  ngOnInit(): void {
    this.filterData();
  }

  filterData(): void {
    if (!this.keyword) {
      this.filteredData = this.data;
    } else {
      const kw = this.keyword.toLowerCase();
      this.filteredData = this.data.filter(x => 
        (x.code + x.name).toLowerCase().includes(kw)
      );
    }
    this.cdr.markForCheck();
  }

  // hàm tìm kiếm
  onSearch(): void {
    this.keyword = this.searchInput;
    this.filterData();
  }

  // Đổi tên hàm
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

  // Mở modal Sửa
  showEditModal(course: (typeof this.data)[0]): void {
    this.isEditing = true;
    this.editingId = course.id;
    this.isVisible = true;
    this.courseForm = {
      code: course.code,
      name: course.name,
      credits: course.credits
    };
  }

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

  handleOk(): void {
    if (!this.courseForm.code || !this.courseForm.name) {
      alert('Vui lòng nhập Mã và Tên học phần!');
      return;
    }

    if (this.isEditing && this.editingId) {
      const index = this.data.findIndex(c => c.id === this.editingId);
      if (index !== -1) {
        this.data[index] = {
          ...this.data[index], 
          code: this.courseForm.code,
          name: this.courseForm.name,
          credits: this.courseForm.credits
        };
        this.data = [...this.data];
      }
    } else {
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