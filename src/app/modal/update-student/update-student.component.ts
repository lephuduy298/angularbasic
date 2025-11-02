import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Student} from '../../features/services/student.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-update-student',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './update-student.component.html',
  styleUrl: './update-student.component.scss'
})
export class UpdateStudentComponent implements OnInit {
  @Input() studentData!: Student;
  @Output() updateStudentEmit = new EventEmitter<Student>();
  @Output() newStudentEmit = new EventEmitter<Student>();
  @Output () closeModal: EventEmitter<void> = new EventEmitter();

  formStudent!: FormGroup;
  action: string ='';

  ngOnInit() {
    this.formStudent = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      grades: new FormControl('', [Validators.required, Validators.min(0), Validators.max(10)])
    })

    if (this.studentData) {
      this.formStudent.patchValue(this.studentData);
      this.action = this.studentData.id ? 'Cập nhật sinh viên' : 'Thêm sinh viên mới';
    }
  }

  // newStudents = [
  //   {id: 4, name: 'Le Duy', grades: 10},
  //   {id: 5, name: 'Tran Thi b', grades: 10},
  //   {id: 6, name: 'Lê Hoàng d', grades: 10}
  // ];

  //
  // onchangeStudent() {
  //
  //   this.studentsEmit.emit(this.newStudents);
  // }

  closeUpdateForm() {
    this.closeModal.emit();
    this.studentData = {} as Student;
  }

  updatedStudent(student: Student) {
    if(student.id){
      this.updateStudentEmit.emit(this.studentData);
    }
    else {
      if(student.id == 0){
        // @ts-ignore
        delete student.id;
      }
      this.newStudentEmit.emit(this.studentData);
    }
  }

  onSubmit() {
      // updatedStudent(studentData)
      console.log(2323232);
      // console.log(this.formStudent.value);
      this.studentData = {
        ...this.formStudent.value,
        grades: Number(this.formStudent.value.grades),
      }
      this.updatedStudent(this.studentData);
      this.closeUpdateForm();
      // this.studentData.grades = this.formStudent.value.grades;
      // console.log(this.studentData);
  }
}

