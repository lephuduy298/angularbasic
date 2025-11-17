import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CommonModule} from '@angular/common';

export interface SelectOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-select-modal',
  standalone: true,
  templateUrl: './select-modal.component.html',
  styleUrl: './select-modal.component.scss',
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule],
})
export class SelectModalComponent implements OnInit {
  @Input() placeholder: string = 'Select';
  @Input() options: SelectOption[] = [];
  @Input() multiple: boolean = false;
  @Input() initialValue: any = null;
  @Input() width: string = '100%';

  @Output() selectionChange = new EventEmitter<any>();

  selectControl = new FormControl();

  ngOnInit() {
    if (this.initialValue !== null && this.initialValue !== undefined) {
      console.log("Setting initial value:", this.initialValue);
      this.selectControl.setValue(this.initialValue);
    }

    this.selectControl.valueChanges.subscribe(value => {
      this.selectionChange.emit(value);
    });
  }

  // Get the label of the first selected item
  getFirstSelectedLabel(): string {
    const values = this.selectControl.value;
    if (!values || (Array.isArray(values) && values.length === 0)) {
      return '';
    }

    const firstValue = Array.isArray(values) ? values[0] : values;
    const option = this.options.find(opt => opt.value === firstValue);
    return option ? option.label : '';
  }

  // Get count of selected items
  getSelectedCount(): number {
    const values = this.selectControl.value;
    if (!values) return 0;
    return Array.isArray(values) ? values.length : 1;
  }
}
