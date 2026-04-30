import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from '../../core/service/user.service';
import { UserMockService } from '../../core/service/user-mock.service';
import { Validators } from '@angular/forms';
import { UserFormComponent } from '../user-form/user-form.component';
import { By } from '@angular/platform-browser';
import { Login } from '../../core/models/Login';
import { of } from 'rxjs/internal/observable/of';
import { AuthService } from '../../core/service/user-auth.service';
import { AuthMockService } from '../../core/service/auth-mock.service';
import { throwError } from 'rxjs/internal/observable/throwError';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userFormComponent: UserFormComponent; 
  let userService: UserMockService;
  let authService: AuthMockService;

  const mockLoginFields = [
    { name: 'login', label: 'Login', type: 'text', validators: [Validators.required] },
    { name: 'password', label: 'Password', type: 'password', validators: [Validators.required] }
  ];

  const mockFormData = {
    login: 'johndoe',
    password: 'password123'
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, UserFormComponent],
      providers: [
        provideHttpClient(),
        { provide: UserService, useClass: UserMockService },
        { provide: AuthService, useClass: AuthMockService },
      ]
    })
    .compileComponents();

    // Mock the alert function
    global.alert = jest.fn();
    // Inject the UserMockService
    userService = TestBed.inject(UserService) as UserMockService;
    // Inject the AuthMockService
    authService = TestBed.inject(AuthService) as AuthMockService;
    // Create the main component fixture
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    
    // Set the input properties before initializing the component
    component.loginFields = mockLoginFields;
    
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
      // Verify that the loginFields are set correctly
      expect(component.loginFields).toEqual(mockLoginFields);
      // Verify that the UserFormComponent receives the correct inputs
      expect(userFormComponent.fields).toEqual(mockLoginFields);
      expect(userFormComponent.initialData).toEqual(mockFormData);
      expect(userFormComponent.submitLabel).toBe('Login');
      expect(userFormComponent.resetLabel).toBe('Clear');
      expect(userFormComponent.formSubmit).toBeDefined();
    });

    it('should initialize the form with the correct initial data', () => {
      expect(userFormComponent.userForm.get('login')?.value).toBe(mockFormData.login);
      expect(userFormComponent.userForm.get('password')?.value).toBe(mockFormData.password);
    });

    it('should have required validators for all fields', () => {
      expect(userFormComponent.userForm.get('login')?.validator).toBeTruthy();
      expect(userFormComponent.userForm.get('password')?.validator).toBeTruthy();
    });

    it('should update the form values when initialData changes', () => {
      const newMockFormData = {
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

      expect(userFormComponent.userForm.get('login')?.value).toBe(newMockFormData.login);
      expect(userFormComponent.userForm.get('password')?.value).toBe(newMockFormData.password);
    });

    it('should update the form values when initialData changes to empty values', () => {
      const newMockFormData = {
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

      expect(userFormComponent.userForm.get('login')?.value).toBe(newMockFormData.login);
      expect(userFormComponent.userForm.get('password')?.value).toBe(newMockFormData.password);
    });

  });

  describe('onSubmit', () => {
    let loginUser: Login;
    let mockToken: string;
    let localStorageSetItemSpy: jest.SpyInstance;
    let routerNavigateSpy: jest.SpyInstance;
    let authServiceSetTokenSpy: jest.SpyInstance;
    let userServiceLoginSpy: jest.SpyInstance;

    const incorrectCredentialsErrorCases = [
      [400, 'Incorrect credentials, please try again.'],
      [401, 'Incorrect credentials, please try again.'],
      [403, 'Incorrect credentials, please try again.']
    ];

    const otherErrorCases: [number | null | undefined, string][] = [
      [500, 'An error occurred, please try again later.'],
      [404, 'An error occurred, please try again later.'],
      [null, 'An error occurred, please try again later.'],
      [undefined, 'An error occurred, please try again later.']
    ];

    beforeEach(() => {
      loginUser = {
        login: mockFormData.login,
        password: mockFormData.password
      };
      mockToken = 'mock-token';
      routerNavigateSpy = jest.spyOn(component['router'], 'navigateByUrl');
      localStorageSetItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    });

    it('should  redirect to "/admin-pannel" page when form is valid', () => {
      userService.login = jest.fn().mockReturnValue(of({ token: 'mock-token'}));
      
      userServiceLoginSpy = jest.spyOn(userService, 'login');
      authServiceSetTokenSpy = jest.spyOn(authService, 'setToken');
      
      // Simulate form submission
      component.onSubmit(mockFormData);

      expect(userServiceLoginSpy).toHaveBeenCalledWith(loginUser)
      expect(authServiceSetTokenSpy).toHaveBeenCalledWith(mockToken);
      expect(localStorageSetItemSpy).toHaveBeenCalledWith('loggedInUser', loginUser.login);
      expect(routerNavigateSpy).toHaveBeenCalledWith('/admin-pannel');

    });

    it.each(incorrectCredentialsErrorCases)('should show, for status "%i",  message "%s" and not redirect to "/admin-pannel" page nor store any token when form is valid but incorrect credentials are provided', (status, expectedMessage) => {
      userService.login = jest.fn().mockReturnValue(throwError(() => ({ status })));
      
      userServiceLoginSpy = jest.spyOn(userService, 'login');
      authServiceSetTokenSpy = jest.spyOn(authService, 'setToken');
      // Simulate form submission
      component.onSubmit(mockFormData);

      expect(userServiceLoginSpy).toHaveBeenCalled()
      expect(alert).toHaveBeenCalledWith(expectedMessage);
      expect(authServiceSetTokenSpy).not.toHaveBeenCalled();
      expect(routerNavigateSpy).not.toHaveBeenCalled();

    });

    it.each(otherErrorCases)('should show, for status "%i",  message "%s" and not redirect to "/admin-pannel" page nor store any token when form is valid but unknown error raised from server', (status, expectedMessage) => {
      userService.login = jest.fn().mockReturnValue(throwError(() => ({ status })));
      
      userServiceLoginSpy = jest.spyOn(userService, 'login');
      authServiceSetTokenSpy = jest.spyOn(authService, 'setToken');
      // Simulate form submission
      component.onSubmit(mockFormData);

      expect(userServiceLoginSpy).toHaveBeenCalled()
      expect(alert).toHaveBeenCalledWith(expectedMessage);
      expect(authServiceSetTokenSpy).not.toHaveBeenCalled();
      expect(routerNavigateSpy).not.toHaveBeenCalled();

    });
    
    it('should not login user nor redirect to "/admin-pannel" nor store any token when given null form data ', () => {
      authServiceSetTokenSpy = jest.spyOn(authService, 'setToken');
      userServiceLoginSpy = jest.spyOn(userService, 'login');
      // Simulate form submission
      component.onSubmit(null);

      expect(userServiceLoginSpy).not.toHaveBeenCalled()
      expect(authServiceSetTokenSpy).not.toHaveBeenCalled();
      expect(localStorageSetItemSpy).not.toHaveBeenCalled();
      expect(routerNavigateSpy).not.toHaveBeenCalled();

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

  describe('onRegisterIfNotRegistered', () => {
    it('should navigate to /register when onRegisterIfNotRegistered is called', () => {
      const routerNavigateSpy = jest.spyOn(component['router'], 'navigateByUrl');
      component.onRegisterIfNotRegistered();
      expect(routerNavigateSpy).toHaveBeenCalledWith('/register');
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
