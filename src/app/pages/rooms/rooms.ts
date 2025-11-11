import { Component, ViewEncapsulation, inject, OnInit, ChangeDetectorRef } from '@angular/core'; // ✅ 1. Thêm ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule
  ],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css',
  encapsulation: ViewEncapsulation.None,
})
export class Rooms implements OnInit { 
  private modal = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef); // ✅ 2. Inject ChangeDetectorRef

  searchInput: string = '';
  keyword: string = '';
  data = [{ id: 'R1', name: 'A101', capacity: 50 }, { id: 'R2', name: 'A102', capacity: 60 }];

  filteredData: (typeof this.data) = [];

  isVisible = false;
  isEditing = false;
  editingId: string | null = null;
  roomForm = {
    name: '',
    capacity: 40
  };

  ngOnInit(): void {
    this.filterData();
  }

  // HÀM MỚI: Dùng để cập nhật 'filteredData'
  filterData(): void {
    if (!this.keyword) {
      this.filteredData = this.data;
    } else {
      this.filteredData = this.data.filter(r =>
        r.name.toLowerCase().includes(this.keyword.toLowerCase())
      );
    }
    
    this.cdr.markForCheck(); // ✅ 3. BUỘC ANGULAR KIỂM TRA THAY ĐỔI
  }

  onSearch(): void {
    this.keyword = this.searchInput;
    this.filterData(); // (Hàm này đã chứa markForCheck)
  }

  showAddModal(): void {
    this.isEditing = false;
    this.editingId = null;
    this.isVisible = true;
    this.roomForm = {
      name: '',
      capacity: 40
    };
  }

  showEditModal(room: { id: string, name: string, capacity: number }): void {
    this.isEditing = true;
    this.editingId = room.id;
    this.isVisible = true;
    this.roomForm = { ...room }; 
  }

  deleteRoom(id: string): void {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc chắn muốn xóa phòng này?',
      nzContent: 'Hành động này sẽ xóa vĩnh viễn và không thể hoàn tác.',
      nzOkText: 'Xóa',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.data = this.data.filter(r => r.id !== id);
        this.filterData(); // (Hàm này đã chứa markForCheck)
      },
      nzCancelText: 'Hủy'
    });
  }

  handleOk(): void {
    if (!this.roomForm.name) {
      alert('Vui lòng nhập tên phòng!');
      return;
    }

    if (this.isEditing && this.editingId) {
      // --- LOGIC SỬA ---
      const index = this.data.findIndex(r => r.id === this.editingId);
      if (index !== -1) {
        this.data[index] = {
          ...this.data[index],
          name: this.roomForm.name,
          capacity: this.roomForm.capacity
        };
        this.data = [...this.data];
      }
    } else {
      // --- LOGIC THÊM MỚI ---
      this.data = [
        ...this.data,
        {
          id: `R${this.data.length + 1}`,
          name: this.roomForm.name,
          capacity: this.roomForm.capacity
        }
      ];
    }
    
    this.isVisible = false;
    this.isEditing = false;
    this.editingId = null;

    this.filterData(); // (Hàm này đã chứa markForCheck)
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isEditing = false;
    this.editingId = null;
  }
}