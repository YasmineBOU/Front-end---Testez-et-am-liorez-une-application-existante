import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUsersComponent } from './list-users.component';
import { UserBasicInfo } from '../../core/models/UserBasicInfo';
import { UserService } from '../../core/service/user.service';
import { UserMockService } from '../../core/service/user-mock.service';
import { provideHttpClient } from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';
import { of } from 'rxjs/internal/observable/of';

describe('ListUsersComponent', () => {
  let component: ListUsersComponent;
  let fixture: ComponentFixture<ListUsersComponent>;
  let userService: UserMockService;

  const mockUserBasicInfo: UserBasicInfo = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    role: 'USER'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListUsersComponent],
      providers: [
        provideHttpClient(),
        { provide: UserService, useClass: UserMockService },
      ]
    })
    .compileComponents();

    // Inject the UserMockService
    userService = TestBed.inject(UserService) as UserMockService;
    fixture = TestBed.createComponent(ListUsersComponent);
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
    it('should load users on init', () => {
      // Mock the listUsers method to return a list of users
      const userServiceListUsersSpy = jest.spyOn(userService, 'listUsers').mockReturnValue(of([mockUserBasicInfo]));
      // Call ngOnInit to trigger the logic
      component.ngOnInit();
      // Verify that 'userService.listUsers' was indeed called
      expect(userServiceListUsersSpy).toHaveBeenCalled();
      expect(component.users).toEqual([mockUserBasicInfo]);
      expect(component.properties).toEqual(Object.keys(mockUserBasicInfo));
      expect(component.isLoading).toBeFalsy();
    });

    it('should handle error when loading users fails', () => {
      // Mock the listUsers method to return an error
      const userServiceListUsersSpy = jest.spyOn(userService, 'listUsers').mockReturnValue(throwError(() => new Error('Failed to load users')));
      // Call ngOnInit to trigger the logic
      component.ngOnInit();
      // Verify that 'userService.listUsers' was indeed called
      expect(userServiceListUsersSpy).toHaveBeenCalled();
      expect(component.errorMessage).toBe('Unable to load users. Please try again.');
      expect(component.isLoading).toBeFalsy();
    });

    // Additional test to verify that the component correctly handles an empty user list
    it('should handle empty user list', () => {
      // Mock the listUsers method to return an empty list
      const userServiceListUsersSpy = jest.spyOn(userService, 'listUsers').mockReturnValue(of([]));
      // Call ngOnInit to trigger the logic
      component.ngOnInit();
      // Verify that 'userService.listUsers' was indeed called
      expect(userServiceListUsersSpy).toHaveBeenCalled();
      expect(component.users).toEqual([]);
      expect(component.properties).toEqual([]);
      expect(component.isLoading).toBeFalsy();
    });

  });

  describe('onEditUser', () => {
    it('should navigate to "/crud/update-user.userId" page', () => {
      const routerNavigateSpy = jest.spyOn(component['router'], 'navigate');

      component.onEditUser(mockUserBasicInfo);
      expect(routerNavigateSpy).toHaveBeenCalledWith(['/crud/update-user', mockUserBasicInfo.id]);
    });
  });

  describe('onDeleteUser', () => {

    let confirmSpy: jest.SpyInstance;

    beforeEach(() => {
      confirmSpy = jest.spyOn(global, 'confirm').mockReturnValue(false);
    });

    it('should ask for confirmation when deleting a user', () => {
      const userServiceDeleteUserSpy = jest.spyOn(userService, 'deleteUser');
      component.onDeleteUser(mockUserBasicInfo);

      expect(confirmSpy).toHaveBeenCalledWith(`Are you sure you want to delete user ${mockUserBasicInfo.firstName} ${mockUserBasicInfo.lastName}?`);
      expect(userServiceDeleteUserSpy).not.toHaveBeenCalled();
    });

    it('should delete user and update the list when confirmed', () => {
      // Mock confirm to return true
      confirmSpy.mockReturnValue(true);
      const userServiceDeleteUserSpy = jest.spyOn(userService, 'deleteUser').mockReturnValue(of({ success: true }));
      component.users = [mockUserBasicInfo, { ...mockUserBasicInfo, id: 2 }]; // Set initial users list

      component.onDeleteUser(mockUserBasicInfo);

      expect(confirmSpy).toHaveBeenCalled();
      expect(userServiceDeleteUserSpy).toHaveBeenCalledWith(mockUserBasicInfo.id);
      expect(component.users).toEqual([{ ...mockUserBasicInfo, id: 2 }]); // Only the other users should remain in the list
    });

    it('should not delete user when deletion is not confirmed', () => {
      const userServiceDeleteUserSpy = jest.spyOn(userService, 'deleteUser');
      component.users = [mockUserBasicInfo, { ...mockUserBasicInfo, id: 2 }]; // Set initial users list
      component.onDeleteUser(mockUserBasicInfo);

      expect(confirmSpy).toHaveBeenCalled();
      expect(userServiceDeleteUserSpy).not.toHaveBeenCalled();
      expect(component.users).toEqual([mockUserBasicInfo, { ...mockUserBasicInfo, id: 2 }]); // User should still be in the list
    });
  });

  describe('onViewUser', () => {
    it('should navigate to "/crud/read-user.userId" page', () => {
      const routerNavigateSpy = jest.spyOn(component['router'], 'navigate');

      component.onViewUser(mockUserBasicInfo);
      expect(routerNavigateSpy).toHaveBeenCalledWith(['/crud/read-user', mockUserBasicInfo.id]);
    });
  });
});
