import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { FormField } from '../../core/models/FormField';
import { AddUser } from '../../core/models/AddUser';
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
  // constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    const idFromRoute = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    console.log("\n\nUser id from route : ", idFromRoute, typeof idFromRoute);
    if (!idFromRoute) {
      alert('Invalid user id.');
      this.router.navigateByUrl('/crud/list-user');
      return;
    }
    console.log("\n\nFetching user info for id : ", idFromRoute);
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


  onBackHome(): void {
    this.router.navigateByUrl('/crud/list-user');
  }

  onEditUser(): void {
    if (this.userInfo) {
      this.router.navigate(['/crud/update-user', this.userInfo.id]);
    }
  } 

  onDeleteUser(): void { 
    if (this.userInfo && confirm(`Are you sure you want to delete user ${this.userInfo.firstName} ${this.userInfo.lastName}?`)) {
      console.log("\n\nDeleting user with id : ", this.userInfo.id, typeof this.userInfo.id);
      this.userService.deleteUser(this.userInfo.id).subscribe({
        next: () => {
          this.router.navigateByUrl('/crud/list-user');
        }
      });
    }
  }

}
