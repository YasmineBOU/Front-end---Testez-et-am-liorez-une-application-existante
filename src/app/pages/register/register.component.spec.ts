import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from '../../core/service/user.service';
import { UserMockService } from '../../core/service/user-mock.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/internal/observable/of';
import { Register } from '../../core/models/Register';
import { throwError } from 'rxjs/internal/observable/throwError';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userFormComponent: UserFormComponent; 
  let userService: UserMockService;

  const mockRegisterFields = [
    { name: 'firstName', label: 'First Name', type: 'text', validators: [Validators.required] },
    { name: 'lastName', label: 'Last Name', type: 'text', validators: [Validators.required] },
    { name: 'login', label: 'Login', type: 'text', validators: [Validators.required] },
    { name: 'password', label: 'Password', type: 'password', validators: [Validators.required] }
  ];

  const mockFormData = {
    firstName: 'John',
    lastName: 'Doe',
    login: 'johndoe',
    password: 'password123'
  };
  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, UserFormComponent],
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
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    // Set the input properties before initializing the component
    component.registerFields = mockRegisterFields;
    component.submitted = false;
    
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
      // Verify that the registerFields are set correctly
      expect(component.registerFields).toEqual(mockRegisterFields);
      // Verify that the UserFormComponent receives the correct inputs
      expect(userFormComponent.fields).toEqual(mockRegisterFields);
      expect(userFormComponent.initialData).toEqual(mockFormData);
      expect(userFormComponent.submitLabel).toBe('Register');
      expect(userFormComponent.resetLabel).toBe('Clear');
      expect(userFormComponent.formSubmit).toBeDefined();
    });

    it('should initialize the form with the correct initial data', () => {
      expect(userFormComponent.userForm.get('firstName')?.value).toBe(mockFormData.firstName);
      expect(userFormComponent.userForm.get('lastName')?.value).toBe(mockFormData.lastName);
      expect(userFormComponent.userForm.get('login')?.value).toBe(mockFormData.login);
      expect(userFormComponent.userForm.get('password')?.value).toBe(mockFormData.password);
    });

    it('should have required validators for all fields', () => {
      expect(userFormComponent.userForm.get('firstName')?.validator).toBeTruthy();
      expect(userFormComponent.userForm.get('lastName')?.validator).toBeTruthy();
      expect(userFormComponent.userForm.get('login')?.validator).toBeTruthy();
      expect(userFormComponent.userForm.get('password')?.validator).toBeTruthy();
    });

    it('should update the form values when initialData changes', () => {
      const newMockFormData = {
        firstName: 'Jane',
        lastName: 'Smith',
        login: 'janesmith',
        password: 'newpassword'
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
    });

    it('should update the form values when initialData changes to empty values', () => {
      const newMockFormData = {
        firstName: '',
        lastName: '',
        login: '',
        password: ''
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
    });

  });

  describe('onSubmit', () => {
      let userServiceRegisterSpy: jest.SpyInstance;
      let registerUser: Register;
      let routerNavigateSpy: jest.SpyInstance;

    beforeEach(() => {
      registerUser = {
        firstName: mockFormData.firstName,
        lastName: mockFormData.lastName,
        login: mockFormData.login,
        password: mockFormData.password
      };

      routerNavigateSpy = jest.spyOn(component['router'], 'navigateByUrl');
    });

    it('should  redirect to "login" page when form is valid', () => {
      userService.register = jest.fn().mockReturnValue(of({success: true}));
      
      userServiceRegisterSpy = jest.spyOn(userService, 'register');
      // Simulate form submission
      component.onSubmit(mockFormData);

      expect(userServiceRegisterSpy).toHaveBeenCalledWith(registerUser)
      expect(alert).toHaveBeenCalledWith('Successful registration!');
      expect(routerNavigateSpy).toHaveBeenCalledWith('login');

    });

    it('should  not redirect to "login" page when form is valid but error is thrown from server', () => {
      userService.register = jest.fn().mockReturnValue(throwError(() => new Error('Network error')));
      
      userServiceRegisterSpy = jest.spyOn(userService, 'register');
      // Simulate form submission
      component.onSubmit(mockFormData);

      expect(userServiceRegisterSpy).toHaveBeenCalled()
      expect(alert).toHaveBeenCalledWith("Something went wrong : Network error");
      expect(routerNavigateSpy).not.toHaveBeenCalled();

    });
    
    it('should not register user when given null form data ', () => {
      // userService.register = jest.fn().mockReturnValue(of());
      
      userServiceRegisterSpy = jest.spyOn(userService, 'register');
      // Simulate form submission
      component.onSubmit(null);

      expect(userServiceRegisterSpy).not.toHaveBeenCalled()

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
      
  })

  describe('onLoginIfAlreadyRegistered', () => {
    it('should navigate to /login when onLoginIfAlreadyRegistered is called', () => {
      const routerNavigateSpy = jest.spyOn(component['router'], 'navigateByUrl');
      component.onLoginIfAlreadyRegistered();
      expect(routerNavigateSpy).toHaveBeenCalledWith('/login');
    });
  });

  describe('onBackHome', () => {
    it('should navigate to home when onBackHome is called', () => {
      const routerNavigateSpy = jest.spyOn(component['router'], 'navigateByUrl');
      component.onBackHome();
      expect(routerNavigateSpy).toHaveBeenCalledWith('');
    });
  });

});
