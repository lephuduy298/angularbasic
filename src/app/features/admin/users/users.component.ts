import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../../models/user.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, HeaderComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  isUpdateForm = false;
  isAddingUser = false;
  selectedUser: User = {} as User;
  p: string | number | undefined;
  searchKeyword: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      console.log('Users loaded:', users);
    });
  }

  addUser(user: User): void {
    this.userService.addUser(user).subscribe(newUser => {
      this.users.push(newUser);
      this.closeUpdateForm();
      this.getAllUsers();
    });
  }

  showUserForm(user?: User): void {
    if (user) {
      this.selectedUser = { ...user };
      this.isUpdateForm = true;
    } else {
      this.selectedUser = {} as User;
      this.isAddingUser = true;
    }
  }

  updateUser(user: User): void {
    this.userService.updateUser(user.userName, user).subscribe(() => {
      this.getAllUsers();
      this.closeUpdateForm();
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Bạn có chắc chắn muốn xóa user ${user.userName}?`)) {
      this.userService.deleteUser(user.userName).subscribe(() => {
        this.getAllUsers();
      });
    }
  }

  closeUpdateForm(): void {
    this.isUpdateForm = false;
    this.isAddingUser = false;
    this.selectedUser = {} as User;
  }

  onSearch(): void {
    // Filtering is done in the getter
  }

  get filteredUsers(): User[] {
    if (!this.searchKeyword || this.searchKeyword.trim() === '') {
      return this.users;
    }

    const searchTerm = this.searchKeyword.toLowerCase().trim();
    return this.users.filter(user =>
      user.userName.toLowerCase().includes(searchTerm) ||
      user.fullName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.phoneNumber.includes(searchTerm)
    );
  }

  saveUser(): void {
    if (this.isAddingUser) {
      this.addUser(this.selectedUser);
    } else if (this.isUpdateForm) {
      this.updateUser(this.selectedUser);
    }
  }
}

