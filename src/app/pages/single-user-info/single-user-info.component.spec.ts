import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleUserInfoComponent } from './single-user-info.component';
import { provideHttpClient } from '@angular/common/http';
import { UserBasicInfo } from '../../core/models/UserBasicInfo';
import { UserService } from '../../core/service/user.service';
import { UserMockService } from '../../core/service/user-mock.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs';
import { UserDetailInfo } from '../../core/models/UserDetailInfo';

describe('SingleUserInfoComponent', () => {
  let component: SingleUserInfoComponent;
  let fixture: ComponentFixture<SingleUserInfoComponent>;
  let userService: UserMockService;
  let mockActivatedRoute: {
    snapshot: {
      paramMap: {
        get: jest.Mock<string | null, [string]>
      }
    }
  };

  const mockUserDetailInfo: UserDetailInfo = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    login: 'johndoe',
    role: 'USER',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  };

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue(mockUserDetailInfo.id)
        }
      }
    };
    await TestBed.configureTestingModule({
      imports: [SingleUserInfoComponent],
      providers: [
        provideHttpClient(),
        { provide: UserService, useClass: UserMockService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();
    // Mock the alert function
    global.alert = jest.fn();

    // Inject the UserMockService
    userService = TestBed.inject(UserService) as UserMockService;

    fixture = TestBed.createComponent(SingleUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {

    let routerNavigateSpy: jest.SpyInstance;
    beforeEach(() => {
      routerNavigateSpy = jest.spyOn(component['router'], 'navigateByUrl');
    });

    it('should not load user info when idFromRoute is null', () => {
      component.userInfo = null;
      // Mock the ActivatedRoute to return null for the user ID
      mockActivatedRoute.snapshot.paramMap.get.mockReturnValue(null);
      const userServiceGetUserInfoSpy = jest.spyOn(userService, 'getUserById');
      // Call ngOnInit to trigger the logic
      component.ngOnInit();
      // Verify that 'userService.getUserInfo' was indeed called with the correct user ID
      expect(global.alert).toHaveBeenCalledWith('Invalid user id.');
      expect(routerNavigateSpy).toHaveBeenCalledWith('/crud/list-user');
      expect(userServiceGetUserInfoSpy).not.toHaveBeenCalled();
      expect(component.userInfo).toBeNull();
    });

    it('should load user info on init when idFromRoute is valid', () => {
      // Mock the getUserById method to return user info
      const userServiceGetUserInfoSpy = jest.spyOn(userService, 'getUserById').mockReturnValue(of(mockUserDetailInfo));
      // Call ngOnInit to trigger the logic
      component.ngOnInit();
      // Verify that 'userService.getUserInfo' was indeed called with the correct user ID
      expect(userServiceGetUserInfoSpy).toHaveBeenCalledWith(mockUserDetailInfo.id);
      expect(component.userInfo).toEqual(mockUserDetailInfo);
    });

    it('should show alert when loading user info fails', () => {
      const errorMessage = 'Failed to load user info';
      component.userInfo = null;
      const userServiceGetUserInfoSpy = jest.spyOn(userService, 'getUserById').mockReturnValue(throwError(() => new Error(errorMessage)));
      
      component.ngOnInit();

      expect(userServiceGetUserInfoSpy).toHaveBeenCalledWith(mockUserDetailInfo.id);
      expect(global.alert).toHaveBeenCalledWith('Unable to load user: ' + errorMessage);
      expect(routerNavigateSpy).toHaveBeenCalledWith('/crud/list-user');
      expect(component.userInfo).toBeNull();
    });
  }); 
  
  describe('onBackToUserList', () => {
    it('should navigate to user list page', () => {
      const routerNavigateSpy = jest.spyOn(component['router'], 'navigateByUrl');
      component.onBackToUserList();
      expect(routerNavigateSpy).toHaveBeenCalledWith('/crud/list-user');
    });
  });  

  describe('onEditUser', () => {
    it('should navigate to "/crud/update-user.userId" page', () => {
      const routerNavigateSpy = jest.spyOn(component['router'], 'navigate');

      component.onEditUser();
      expect(routerNavigateSpy).toHaveBeenCalledWith(['/crud/update-user', mockUserDetailInfo.id]);
    });
  });
  
    describe('onDeleteUser', () => {
  
      let confirmSpy: jest.SpyInstance;
      let routerNavigateSpy: jest.SpyInstance;

      beforeEach(() => {
        confirmSpy = jest.spyOn(global, 'confirm').mockReturnValue(false);
        routerNavigateSpy = jest.spyOn(component['router'], 'navigateByUrl');
        global.alert = jest.fn();
      });
  
      it('should ask for confirmation when deleting a user', () => {
        const userServiceDeleteUserSpy = jest.spyOn(userService, 'deleteUser');
        component.onDeleteUser();
  
        expect(confirmSpy).toHaveBeenCalledWith(`Are you sure you want to delete user ${mockUserDetailInfo.firstName} ${mockUserDetailInfo.lastName}?`);
        expect(userServiceDeleteUserSpy).not.toHaveBeenCalled();
      });
      
      it('should not delete user userInfo is null', () => {
        const userServiceDeleteUserSpy = jest.spyOn(userService, 'deleteUser');
        component.userInfo = null;
        component.onDeleteUser();
  
        expect(userServiceDeleteUserSpy).not.toHaveBeenCalled();
      });
  
      it('should not delete user when deletion is not confirmed', () => {
        const userServiceDeleteUserSpy = jest.spyOn(userService, 'deleteUser');
        component.onDeleteUser();
  
        expect(confirmSpy).toHaveBeenCalled();
        expect(userServiceDeleteUserSpy).not.toHaveBeenCalled();
        expect(routerNavigateSpy).not.toHaveBeenCalled();
      });

      it('should delete user and redirect to "/crud/list-user" when confirmed and userInfo is not null', () => {
        // Mock confirm to return true
        confirmSpy.mockReturnValue(true);
        const userServiceDeleteUserSpy = jest.spyOn(userService, 'deleteUser').mockReturnValue(of({ success: true }));
  
        component.onDeleteUser();
  
        expect(confirmSpy).toHaveBeenCalled();
        expect(userServiceDeleteUserSpy).toHaveBeenCalledWith(mockUserDetailInfo.id);
        expect(routerNavigateSpy).toHaveBeenCalledWith('/crud/list-user');
      });

      it('should show alert when deletion fails', () => {
        const errorMessage = 'Deletion failed';
        confirmSpy.mockReturnValue(true);
        const userServiceDeleteUserSpy = jest.spyOn(userService, 'deleteUser').mockReturnValue(throwError (() => new Error(errorMessage)));

        component.onDeleteUser();

        expect(confirmSpy).toHaveBeenCalled();
        expect(userServiceDeleteUserSpy).toHaveBeenCalledWith(mockUserDetailInfo.id);
        expect(global.alert).toHaveBeenCalledWith(`Unable to delete user: ${errorMessage}`);
      });

    });


});
