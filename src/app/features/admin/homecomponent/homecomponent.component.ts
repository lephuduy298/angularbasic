import { Component, OnInit } from '@angular/core';
import {StudentService} from '../../services/student.service';
import {Student} from '../../services/student.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {UpdateStudentComponent} from '../../../modal/update-student/update-student.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {SearchComponent} from '../../../modal/search/search.component';
import {HeaderComponent} from '../../header/header.component';


@Component({
  selector: 'app-homecomponent',
  imports: [CommonModule, FormsModule, UpdateStudentComponent, NgxPaginationModule, SearchComponent, HeaderComponent],
  templateUrl: './homecomponent.component.html',
  styleUrl: './homecomponent.component.scss',
  standalone: true
})
export class HomecomponentComponent implements OnInit {
  students: Student[] = [];
  isUpdateForm = false;
  isAddingStudent = false;
  selectedStudent: Student = {} as Student;
  p: string | number | undefined;
  gradeSort: 'asc' | 'desc' | null = null;
  nameSort: 'asc' | 'desc' | null = null;
  keyword: string = '';


  constructor(private studentService: StudentService) {

  }

  ngOnInit(): void {
    this.getAllStudents();
  }



  getAllStudents(): void {
    this.studentService.getStudents().subscribe(students =>
      this.students = students);
  }

  addStudent(student: Student): void {
    this.studentService.addStudent(student).subscribe(student => {
      this.students.push(student);
      this.selectedStudent = {} as Student;
      this.getAllStudents();
    });
  }

  showStudent(student?: Student): void {
      if(student){
        this.selectedStudent = student;
      }
      this.isUpdateForm = true;
    console.log(this.selectedStudent,222);

  }

  updateStudent(student: Student): void {
    this.studentService.updateStudent(student).subscribe(data => {
      this.getAllStudents();
      this.selectedStudent = {id: 0, name: '', grades: 0};
    });
  }

  deleteStudent(student: Student) {

    this.studentService.deleteStudent(student.id).subscribe(() => {
    this.getAllStudents();
  });
  }

  closeUpdateForm() {
    this.isUpdateForm = false;
    this.isAddingStudent = false;
    this.selectedStudent = {} as Student;
  }

  onSearch(keyword: string): void {
    this.keyword = keyword;
  }

  // Getter
  get sortedStudents(): Student[] {
    let list = [...this.students];

    // Filter by keyword first
    if (this.keyword && this.keyword.trim() !== '') {
      const searchTerm = this.keyword.toLowerCase().trim();
      list = list.filter(student =>
        student.name.toLowerCase().includes(searchTerm) ||
        student.id.toString().includes(searchTerm) ||
        student.grades.toString().includes(searchTerm)
      );
    }

    // if no sort set, return filtered list
    if (!this.nameSort && !this.gradeSort) {
      return list;
    }

    // Sort the filtered list
    return list.sort((a, b) => {
      // If name sort is active, sort by name first
      if (this.nameSort) {
        const nameA = a.name ?? '';
        const nameB = b.name ?? '';
        const cmp = nameA.localeCompare(nameB, undefined, {sensitivity: 'base'});
        if (cmp !== 0) {
          return this.nameSort === 'asc' ? cmp : -cmp;
        }
        // if names equal and gradeSort exists, fall through to grade comparison
      }

      // If grade sort is active, sort by grades
      if (this.gradeSort) {
        const gradeDiff = a.grades - b.grades;
        return this.gradeSort === 'asc' ? gradeDiff : -gradeDiff;
      }
      return 0;
    });
  }

  sortByGrade(): void {
    this.nameSort = null;
    if (this.gradeSort === null) {
      this.gradeSort = 'asc';
    } else if (this.gradeSort === 'asc') {
      this.gradeSort = 'desc';
    } else {
      this.gradeSort = null;
    }
  }

  sortByName(): void {
    this.gradeSort = null;
    if (this.nameSort === null) {
      this.nameSort = 'asc';
    } else if (this.nameSort === 'asc') {
      this.nameSort = 'desc';
    } else {
      this.nameSort = null;
    }
  }
}
