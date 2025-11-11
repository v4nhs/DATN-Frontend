import { Component, inject } from '@angular/core'; // ✅ 1. Thêm 'inject'
import { CommonModule } from '@angular/common';
import { 
  ReactiveFormsModule, // ✅ 2. Thêm 'ReactiveFormsModule'
  NonNullableFormBuilder, // ✅ 3. Thêm 'NonNullableFormBuilder'
  Validators // ✅ 4. Thêm 'Validators'
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    NzFormModule, 
    NzInputModule, 
    NzButtonModule, 
    NzCheckboxModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  // ✅ 1, 3, 4: Các hàm đã được import
  private fb = inject(NonNullableFormBuilder);
  validateForm = this.fb.group({
    username: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
    remember: this.fb.control(true)
  });

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}