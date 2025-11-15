import {Component, OnInit} from '@angular/core';
import {NgClass} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-logincomponent',
  imports: [
    NgClass,
    ReactiveFormsModule
  ],
  templateUrl: './logincomponent.component.html',
  styleUrl: './logincomponent.component.scss',
  standalone: true
})
export class LogincomponentComponent {
}
