import { Component, ViewEncapsulation, inject, OnInit } from '@angular/core'; // ✅ 1. Thêm OnInit
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal'; 

@Component({
  selector: 'app-exam-sessions',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    FormsModule,
    NzIconModule,
    NzGridModule,
    NzModalModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzRadioModule
  ],
  templateUrl: './exam-sessions.html',
  styleUrls: ['./exam-sessions.css'],
  encapsulation: ViewEncapsulation.None
})
export class ExamSessions implements OnInit {
  private modal = inject(NzModalService);
  searchInput: string = '';
  keyword: string = '';
  isVisible = false;
  isEditing = false;
  editingId: string | null = null;

  data = [{ id: 'ES1', name: 'Học kỳ 1 2024-2025', startDate: '2025-01-01', endDate: '2025-01-20', action: '' }];

  // ✅ 3. Đổi 'get filteredData()' thành một thuộc tính bình thường
  filteredData: (typeof this.data) = [];

  sessionForm = {
    name: '',
    startDate: '',
    endDate: ''
  };

  // ✅ 4. Gọi filterData() khi component vừa tải xong
  ngOnInit(): void {
    this.filterData(); 
  }

  // ✅ 5. HÀM MỚI: Dùng để cập nhật 'filteredData'
  filterData(): void {
    if (!this.keyword) {
      // Nếu không có từ khóa, gán thẳng data
      this.filteredData = this.data; 
      return;
    }
    
    // Nếu có từ khóa, lọc từ 'data' và gán vào 'filteredData'
    this.filteredData = this.data.filter(e => 
      e.name.toLowerCase().includes(this.keyword.toLowerCase())
    );
  }

  onSearch(): void {
    this.keyword = this.searchInput;
    this.filterData(); // ✅ 6. Gọi filterData() sau khi tìm kiếm
  }

  showAddModal(): void {
    this.isEditing = false;
    this.editingId = null;
    this.isVisible = true;
    this.sessionForm = { name: '', startDate: '', endDate: '' };
  }

  showEditModal(session: { id: string, name: string, startDate: string, endDate: string }): void {
    this.isEditing = true;
    this.editingId = session.id;
    this.isVisible = true;
    this.sessionForm = { 
      name: session.name, 
      startDate: session.startDate, 
      endDate: session.endDate 
    };
  }

  deleteSession(id: string): void {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc chắn muốn xóa đợt thi này?',
      nzContent: 'Hành động này sẽ xóa vĩnh viễn và không thể hoàn tác.',
      nzOkText: 'Xóa',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.data = this.data.filter(e => e.id !== id);
        this.filterData(); // ✅ 7. Gọi filterData() sau khi xóa
      },
      nzCancelText: 'Hủy'
    });
  }

  handleOk(): void {
    if (!this.sessionForm.name || !this.sessionForm.startDate || !this.sessionForm.endDate) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (this.isEditing && this.editingId) {
      const index = this.data.findIndex(e => e.id === this.editingId);
      if (index !== -1) {
        this.data[index] = {
          ...this.data[index],
          name: this.sessionForm.name,
          startDate: this.sessionForm.startDate,
          endDate: this.sessionForm.endDate,
        };
        this.data = [...this.data]; 
      }
    } else {
      this.data = [
        ...this.data, 
        {             
          id: (this.data.length + 1).toString(),
          name: this.sessionForm.name,
          startDate: this.sessionForm.startDate,
          endDate: this.sessionForm.endDate,
          action: ''
        }
      ];
    }

    this.isVisible = false;
    this.isEditing = false;
    this.editingId = null;
    
    this.filterData(); // ✅ 8. Gọi filterData() sau khi Thêm hoặc Sửa
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isEditing = false;
    this.editingId = null;
  }
}