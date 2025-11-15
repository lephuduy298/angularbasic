import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './search-modal.component.html',
  styleUrl: './search-modal.component.scss'
})
export class SearchModalComponent implements OnInit, OnDestroy {
  @Input() placeholder: string = 'Tìm kiếm...';
  @Input() debounceTime: number = 300;
  @Input() minLength: number = 0;
  @Input() initialValue: string = '';
  @Input() width: string = '100%';

  @Output() searchChange = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  searchControl = new FormControl('');
  private subscription?: Subscription;

  ngOnInit(): void {
    if (this.initialValue) {
      this.searchControl.setValue(this.initialValue);
    }

    this.subscription = this.searchControl.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe(value => {
        const searchValue = value?.trim() || '';
        if (searchValue.length >= this.minLength) {
          this.searchChange.emit(searchValue);
        } else if (searchValue.length === 0) {
          this.searchChange.emit('');
        }
      });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.searchChange.emit('');
    this.clear.emit();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
