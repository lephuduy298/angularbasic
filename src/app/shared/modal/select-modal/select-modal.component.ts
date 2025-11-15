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
    if (this.initialValue) {
      this.selectControl.setValue(this.initialValue);
    }

    this.selectControl.valueChanges.subscribe(value => {
      this.selectionChange.emit(value);
    });
  }
}
