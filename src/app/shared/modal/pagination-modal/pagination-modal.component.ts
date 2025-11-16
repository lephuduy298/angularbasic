import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-pagination-modal',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './pagination-modal.component.html',
  styleUrls: ['./pagination-modal.component.scss']
})
export class PaginationModalComponent {
  @Input() length: number = 0; // Total number of items
  @Input() pageSize: number = 10; // Items per page
  @Input() pageIndex: number = 0; // Current page (0-based)
  @Input() pageSizeOptions: number[] = [5, 10, 15, 20, 25, 50]; // Page size options
  @Input() showFirstLastButtons: boolean = true; // Show first/last buttons

  @Output() pageChange = new EventEmitter<PageEvent>();

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }
}

