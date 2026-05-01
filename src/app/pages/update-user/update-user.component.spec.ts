import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserComponent } from './update-user.component';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from '../../core/service/user.service';
import { UserMockService } from '../../core/service/user-mock.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs/internal/observable/throwError';
import { AddUser } from '../../core/models/AddUser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('UpdateUserComponent', () => {
  let component: UpdateUserComponent;
  let fixture: ComponentFixture<UpdateUserComponent>;
  let userFormComponent: UserFormComponent; 
  let userService: UserMockService;
  let mockActivatedRoute: {
    snapshot: {
      paramMap: {
        get: jest.Mock<string | null, [string]>
      }
    }
  };

  const mockUpdateUserFields = [
    { name: 'firstName', label: 'First Name', type: 'text', validators: [Validators.required] },
    { name: 'lastName', label: 'Last Name', type: 'text', validators: [Validators.required] },
    { name: 'login', label: 'Login', type: 'text', validators: [Validators.required] },
    { name: 'password', label: 'Password', type: 'password'},
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      validators: [Validators.required],
      options: [
        { key: 'user', value: 'USER' },
        { key: 'admin', value: 'ADMIN' }
      ]
    }
  ];

  const mockFormData = {
    firstName: 'John',
    lastName: 'Doe',
    login: 'johndoe',
    password: '',
    role: 'USER'
  };
  
  const updatedUserId: number = 123;

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue(updatedUserId)
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, UpdateUserComponent, UserFormComponent],
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
    // Create the main component fixture
    fixture = TestBed.createComponent(UpdateUserComponent);
    component = fixture.componentInstance;

    // Set the input properties before initializing the component
    component.updateUserFields = mockUpdateUserFields;
    
    // Access the UserFormComponent instance from the template
    userFormComponent = fixture.debugElement.query(By.directive(UserFormComponent)).componentInstance;
    userFormComponent.initialData = mockFormData;


    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {

    let userServiceGetUserByIdSpy: jest.SpyInstance;
    beforeEach(() => {
      component.userId = null;
    });

    it('should initialize updateUserFields with the correct field definitions', () => {
      // Verify that the updateUserFields are set correctly
      expect(component.updateUserFields).toEqual(mockUpdateUserFields);
      // Verify that the UserFormComponent receives the correct inputs
      expect(userFormComponent.fields).toEqual(mockUpdateUserFields);
      expect(userFormComponent.initialData).toEqual(mockFormData);
      expect(userFormComponent.submitLabel).toBe('Update');
      expect(userFormComponent.resetLabel).toBe('Clear');
      expect(userFormComponent.formSubmit).toBeDefined();
    });

    it('should initialize the form with the correct initial data', () => {
      expect(userFormComponent.userForm.get('firstName')?.value).toBe(mockFormData.firstName);
      expect(userFormComponent.userForm.get('lastName')?.value).toBe(mockFormData.lastName);
      expect(userFormComponent.userForm.get('login')?.value).toBe(mockFormData.login);
      // The password field should be empty for security reasons, even when editing an existing user
      expect(userFormComponent.userForm.get('password')?.value).toBe("");
      expect(userFormComponent.userForm.get('role')?.value).toBe(mockFormData.role);
    });

    it('should have required validators for all fields', () => {
      expect(userFormComponent.userForm.get('firstName')?.validator).toBeTruthy();
      expect(userFormComponent.userForm.get('lastName')?.validator).toBeTruthy();
      expect(userFormComponent.userForm.get('login')?.validator).toBeTruthy();
      expect(userFormComponent.userForm.get('password')?.validator).toBeFalsy();
      expect(userFormComponent.userForm.get('role')?.validator).toBeTruthy();
    });

    it('should update the form values when initialData changes', () => {
      const newMockFormData = {
        firstName: 'Jane',
        lastName: 'Smith',
        login: 'janesmith',
        password: 'newpassword',
        role: 'ADMIN'
      };
      userFormComponent.initialData = newMockFormData;
      userFormComponent.ngOnChanges({
        initialData: {
          currentValue: newMockFormData,
          previousValue: mockFormData,
          firstChange: false,
          isFirstChange: () => false
        }
      });

      expect(userFormComponent.userForm.get('firstName')?.value).toBe(newMockFormData.firstName);
      expect(userFormComponent.userForm.get('lastName')?.value).toBe(newMockFormData.lastName);
      expect(userFormComponent.userForm.get('login')?.value).toBe(newMockFormData.login);
      expect(userFormComponent.userForm.get('password')?.value).toBe(newMockFormData.password);
      expect(userFormComponent.userForm.get('role')?.value).toBe(newMockFormData.role);
    });

    it('should update the form values when initialData changes to empty values', () => {
      const newMockFormData = {
        firstName: '',
        lastName: '',
        login: '',
        password: '',
        role: ''
      };
      userFormComponent.initialData = newMockFormData;
      userFormComponent.ngOnChanges({
        initialData: {
          currentValue: newMockFormData,
          previousValue: mockFormData,
          firstChange: false,
          isFirstChange: () => false
        }
      });

      expect(userFormComponent.userForm.get('firstName')?.value).toBe(newMockFormData.firstName);
      expect(userFormComponent.userForm.get('lastName')?.value).toBe(newMockFormData.lastName);
      expect(userFormComponent.userForm.get('login')?.value).toBe(newMockFormData.login);
      expect(userFormComponent.userForm.get('password')?.value).toBe(newMockFormData.password);
      expect(userFormComponent.userForm.get('role')?.value).toBe(newMockFormData.role);
    });

    it('should redirect to "/crud/list-user" and alert if no id found in the route ', () => {
      const routerNavigateSpy = jest.spyOn(component['router'], 'navigateByUrl');
      const userServiceGetUserByIdSpy = jest.spyOn(userService, 'getUserById');

      mockActivatedRoute.snapshot.paramMap.get.mockReturnValue(null);

      component.ngOnInit();

      expect(global.alert).toHaveBeenCalledWith('Invalid user id.');
      expect(component.userId).toBeNull();
      expect(userServiceGetUserByIdSpy).not.toHaveBeenCalled();
      expect(routerNavigateSpy).toHaveBeenCalledWith('/crud/list-user');
    });

    it('should call "getUserById"', () => {
      // Mock the getUserById method to return an observable
      userService.getUserById = jest.fn().mockReturnValue(of());
      // Spy on the getUserById method
      userServiceGetUserByIdSpy = jest.spyOn(userService, 'getUserById');
      // Call ngOnInit to trigger the logic
      component.ngOnInit();
      // Verify that the userId is set
      expect(component.userId).toBe(updatedUserId);
      // Verify that getUserById was indeed called
      expect(userServiceGetUserByIdSpy).toHaveBeenCalled();
    });

    it('should continue if valid id found in the route ', () => {
      const userServiceGetUserByIdSpy = jest.spyOn(userService, 'getUserById');
      
      mockActivatedRoute.snapshot.paramMap.get.mockReturnValue(updatedUserId.toString());

      component.ngOnInit();

      expect(component.userId).toBe(updatedUserId);
      expect(userServiceGetUserByIdSpy).toHaveBeenCalled();
      expect(component.isLoading).toBeFalsy();
    });

    it('should initialize the form with the values returned from "getUserById"', () => {
      
      userService.getUserById = jest.fn().mockReturnValue(of(mockFormData));
      userServiceGetUserByIdSpy = jest.spyOn(userService, 'getUserById');

      component.ngOnInit();

      expect(component.userId).toBe(updatedUserId);
      // Verify that getUserById was called and the user data was loaded
      expect(userServiceGetUserByIdSpy).toHaveBeenCalled();
      // Verify that the UserFormComponent receives the correct initial data
      expect(userFormComponent.initialData).toEqual(mockFormData);
    });

    it('should redirect to "/crud/list-user" if "getUserById" fails', () => {
      const errorMessage = 'User not found';
      const routerNavigateSpy = jest.spyOn(component['router'], 'navigateByUrl');
      userService.getUserById = jest.fn().mockReturnValue(throwError(() => new Error(errorMessage)));
      userServiceGetUserByIdSpy = jest.spyOn(userService, 'getUserById');

      component.ngOnInit();

      expect(component.userId).toBe(updatedUserId);
      // Verify that getUserById was called and the user data was loaded
      expect(userServiceGetUserByIdSpy).toHaveBeenCalled();
      expect(component.isLoading).toBeFalsy();
      expect(global.alert).toHaveBeenCalledWith('Unable to load user: ' + errorMessage);
      expect(routerNavigateSpy).toHaveBeenCalledWith('/crud/list-user');
    });

  });

  describe('onSubmit', () => {
      let userServiceUpdateUserSpy: jest.SpyInstance;
      let routerNavigateSpy: jest.SpyInstance;

    beforeEach(() => {
      routerNavigateSpy = jest.spyOn(component['router'], 'navigateByUrl');
    });
    
    it('should not update user given null form data ', () => {
      
      userServiceUpdateUserSpy = jest.spyOn(userService, 'updateUser');
      // Simulate form submission
      component.onSubmit(null);

      expect(userServiceUpdateUserSpy).not.toHaveBeenCalled()

    });
    
    it('should not update user given null id ', () => {
      component.userId = null;
      userServiceUpdateUserSpy = jest.spyOn(userService, 'updateUser');
      // Simulate form submission with a "supposedly" valid form data 
      // but normally the form would not be valid if the id is null 
      // because the form would not be loaded in the first place
      component.onSubmit(mockFormData);

      expect(userServiceUpdateUserSpy).not.toHaveBeenCalled()

    });

    it('should  redirect to "/crud/list-user" page when form and id are valid', () => {
      const updatedUser: AddUser = {
        firstName: mockFormData.firstName,
        lastName: mockFormData.lastName,
        login: mockFormData.login,
        password: mockFormData.password,
        role: mockFormData.role === 'USER' ? 'USER' : 'ADMIN'
      };
      userService.updateUser = jest.fn().mockReturnValue(of({success: true}));
      
      userServiceUpdateUserSpy = jest.spyOn(userService, 'updateUser');
      // Simulate form submission
      component.onSubmit(mockFormData);

      expect(component.userId).toBe(updatedUserId);
      expect(userServiceUpdateUserSpy).toHaveBeenCalledWith(component.userId, updatedUser)
      expect(alert).toHaveBeenCalledWith('User updated successfully!');
      expect(routerNavigateSpy).toHaveBeenCalledWith('/crud/list-user');

    });

    it('should alert error message when update fails on server', () => {
      const errorMessage = 'Failed to update user';
      const updatedUser: AddUser = {
        firstName: mockFormData.firstName,
        lastName: mockFormData.lastName,
        login: mockFormData.login,
        password: mockFormData.password,
        role: mockFormData.role === 'USER' ? 'USER' : 'ADMIN'
      };
      userService.updateUser = jest.fn().mockReturnValue(throwError(() => new Error(errorMessage)));
      
      userServiceUpdateUserSpy = jest.spyOn(userService, 'updateUser');
      // Simulate form submission
      component.onSubmit(mockFormData);

      expect(userServiceUpdateUserSpy).toHaveBeenCalledWith(component.userId, updatedUser)
      expect(alert).toHaveBeenCalledWith(`Something went wrong: ${errorMessage}`);

    });
  });

  describe('onReset', () => {

    it('should emit formReset event', () => {
      // Mock the formReset event
      const formResetEmitSpy = jest.spyOn(userFormComponent.formReset, 'emit');
      userFormComponent.onReset();
      // Verify that the formReset event was emitted
      expect(formResetEmitSpy).toHaveBeenCalled();
    });
      
  });

});
