import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDetailInfo } from '../../core/models/UserDetailInfo';


@Component({
  selector: 'app-single-user-info',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './single-user-info.component.html',
  styleUrl: './single-user-info.component.css'
})
export class SingleUserInfoComponent implements OnInit {
    private userService = inject(UserService);
    private destroyRef = inject(DestroyRef);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    userInfo: UserDetailInfo | null = null;

  ngOnInit(): void {

    const idFromRoute = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (!idFromRoute) {
      alert('Invalid user id.');
      this.router.navigateByUrl('/crud/list-user');
      return;
    }
    
    this.userService.getUserById(idFromRoute).subscribe({
      next: (user) => {
        this.userInfo = user;
      },
      error: (err) => {
        alert('Unable to load user: ' + err.message);
        this.router.navigateByUrl('/crud/list-user');
      }
    });
  }


  onBackToUserList(): void {
    this.router.navigateByUrl('/crud/list-user');
  }

  onEditUser(): void {
    if (this.userInfo) {
      this.router.navigate(['/crud/update-user', this.userInfo.id]);
    }
  } 

  onDeleteUser(): void { 
    if (this.userInfo && confirm(`Are you sure you want to delete user ${this.userInfo.firstName} ${this.userInfo.lastName}?`)) {
      this.userService.deleteUser(this.userInfo.id).subscribe({
        next: () => {
          this.router.navigateByUrl('/crud/list-user');
        },
        error: (err) => {
          alert('Unable to delete user: ' + err.message);
        }
      });
    }
  }

}
