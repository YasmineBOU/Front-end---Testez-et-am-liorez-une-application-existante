import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserComponent } from './create-user.component';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from '../../core/service/user.service';
import { UserMockService } from '../../core/service/user-mock.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/internal/observable/of';
import { Register } from '../../core/models/Register';
import { throwError } from 'rxjs/internal/observable/throwError';
import { AddUser } from '../../core/models/AddUser';

describe('CreateUserComponent', () => {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;
  let userFormComponent: UserFormComponent; 
  let userService: UserMockService;

  const mockCreateUserFields = [
    { name: 'firstName', label: 'First Name', type: 'text', validators: [Validators.required] },
    { name: 'lastName', label: 'Last Name', type: 'text', validators: [Validators.required] },
    { name: 'login', label: 'Login', type: 'text', validators: [Validators.required] },
    { name: 'password', label: 'Password', type: 'password', validators: [Validators.required] },
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
    password: 'password123',
    role: 'USER'
  };
  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUserComponent, UserFormComponent],
      providers: [
        provideHttpClient(),
        { provide: UserService, useValue: UserMockService },
      ]
    })
    .compileComponents();
    
    // Mock the alert function
    global.alert = jest.fn();
    // Inject the UserMockService
    userService = TestBed.inject(UserService) as UserMockService;
    // Create the main component fixture
    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;

    // Set the input properties before initializing the component
    component.createUserFields = mockCreateUserFields;
    
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

    it('should initialize the form', () => {
      // Verify that the createUserFields are set correctly
      expect(component.createUserFields).toEqual(mockCreateUserFields);
      // Verify that the UserFormComponent receives the correct inputs
      expect(userFormComponent.fields).toEqual(mockCreateUserFields);
      expect(userFormComponent.initialData).toEqual(mockFormData);
      expect(userFormComponent.submitLabel).toBe('Create User');
      expect(userFormComponent.resetLabel).toBe('Clear');
      expect(userFormComponent.formSubmit).toBeDefined();
    });

    it('should initialize the form with the correct initial data', () => {
      expect(userFormComponent.userForm.get('firstName')?.value).toBe(mockFormData.firstName);
      expect(userFormComponent.userForm.get('lastName')?.value).toBe(mockFormData.lastName);
      expect(userFormComponent.userForm.get('login')?.value).toBe(mockFormData.login);
      expect(userFormComponent.userForm.get('password')?.value).toBe(mockFormData.password);
      expect(userFormComponent.userForm.get('role')?.value).toBe(mockFormData.role);
    });

    it('should have required validators for all fields', () => {
      expect(userFormComponent.userForm.get('firstName')?.validator).toBeTruthy();
      expect(userFormComponent.userForm.get('lastName')?.validator).toBeTruthy();
      expect(userFormComponent.userForm.get('login')?.validator).toBeTruthy();
      expect(userFormComponent.userForm.get('password')?.validator).toBeTruthy();
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

  });

  describe('onSubmit', () => {
      let userServiceCreateUserSpy: jest.SpyInstance;
      let routerNavigateSpy: jest.SpyInstance;

    beforeEach(() => {
      routerNavigateSpy = jest.spyOn(component['router'], 'navigateByUrl');
    });

    it('should  redirect to "admin-pannel" page when form is valid', () => {
      const newUser: AddUser = {
        firstName: mockFormData.firstName,
        lastName: mockFormData.lastName,
        login: mockFormData.login,
        password: mockFormData.password,
        role: mockFormData.role === 'USER' ? 'USER' : 'ADMIN'
      };
      userService.createUser = jest.fn().mockReturnValue(of({success: true}));
      
      userServiceCreateUserSpy = jest.spyOn(userService, 'createUser');
      // Simulate form submission
      component.onSubmit(mockFormData);

      expect(userServiceCreateUserSpy).toHaveBeenCalledWith(newUser)
      expect(alert).toHaveBeenCalledWith('User created successfully!');
      expect(routerNavigateSpy).toHaveBeenCalledWith('admin-pannel');

    });

    it('should  not redirect to "admin-pannel" page when form is valid but error is thrown from server', () => {
      const errorMessage = 'Network error';
      userService.createUser = jest.fn().mockReturnValue(throwError(() => new Error(errorMessage)));
      
      userServiceCreateUserSpy = jest.spyOn(userService, 'createUser');
      // Simulate form submission
      component.onSubmit(mockFormData);

      expect(userServiceCreateUserSpy).toHaveBeenCalled()
      expect(alert).toHaveBeenCalledWith(`Something went wrong: ${errorMessage}`);
      expect(routerNavigateSpy).not.toHaveBeenCalled();

    });
    
    it('should not create user when given null form data ', () => {
      
      userServiceCreateUserSpy = jest.spyOn(userService, 'createUser');
      // Simulate form submission
      component.onSubmit(null);

      expect(userServiceCreateUserSpy).not.toHaveBeenCalled()

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
