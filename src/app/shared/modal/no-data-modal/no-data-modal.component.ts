import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-no-data-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './no-data-modal.component.html',
  styleUrl: './no-data-modal.component.scss'
})
export class NoDataModalComponent {
  @Input() icon: string = 'folder_open'; // Default icon
  @Input() title: string = 'Không có dữ liệu';
  @Input() message: string = 'Không tìm thấy dữ liệu phù hợp với tiêu chí tìm kiếm';
}

