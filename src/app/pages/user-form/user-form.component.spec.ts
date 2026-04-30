import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormComponent } from './user-form.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  const mockFields = [
    { name: 'login', label: 'Login', type: 'text', validators: [Validators.required] },
    { name: 'email', label: 'Email', type: 'email', validators: [Validators.required, Validators.email] },
    { name: 'role', label: 'Role', type: 'select', options: [{ key: 'admin', value: 'ADMIN' }, { key: 'user', value: 'USER' }] },
  ];

  const mockInitialData = {
    login: 'testuser',
    email: 'test@example.com',
    role: 'ADMIN',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, UserFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;

    // Set the input properties before initializing the component
    component.fields = mockFields;
    component.initialData = mockInitialData;
    component.submitLabel = 'Submit';
    component.resetLabel = 'Reset';
    component.showResetButton = true;

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit : Form Initialization', () => {
    it('should initialize form with given fields and initial data', () => {
      expect(component.userForm).toBeDefined();
      expect(component.userForm.get('login')).toBeDefined();
      expect(component.userForm.get('email')).toBeDefined();
      expect(component.userForm.get('role')).toBeDefined();
    });

    it("should patch the initial data into the form", () => {
      expect(component.userForm.get('login')?.value).toBe(mockInitialData.login);
      expect(component.userForm.get('email')?.value).toBe(mockInitialData.email);
      expect(component.userForm.get('role')?.value).toBe(mockInitialData.role);
    })
  });

  describe('getControl', () => {
    it('should return the correct form control', () => {
      const loginControl = component.getControl('login');
      expect(loginControl).toBeDefined();
      expect(loginControl).toBe(component.userForm.get('login'));

      const emailControl = component.getControl('email');
      expect(emailControl).toBeDefined();
      expect(emailControl).toBe(component.userForm.get('email'));

      const roleControl = component.getControl('role');
      expect(roleControl).toBeDefined();
      expect(roleControl).toBe(component.userForm.get('role'));
    });

    it('should return null for non-existent control', () => {
      const control = component.getControl('nonExistent');
      expect(control).toBeNull();
    });
  });

  describe('Form Submission', () => {
    it('should emit formSubmit event when the form is valid', () => {
      // Mock the formSubmit event
      const emitSpy = jest.spyOn(component.formSubmit, 'emit');

      // Simulate form submission
      component.onSubmit();

      expect(emitSpy).toHaveBeenCalledWith(mockInitialData);
    });

    it('should mark all controls as touched when the form is invalid', () => {
      // Simulate invalid form by setting required fields to empty
      component.userForm.get('login')?.setValue('');
      component.userForm.get('email')?.setValue('invalid-email');

      const emitSpy = jest.spyOn(component.formSubmit, 'emit');

      component.onSubmit();

      expect(emitSpy).not.toHaveBeenCalled();
      expect(component.userForm.get('login')?.touched).toBeTruthy();
      expect(component.userForm.get('email')?.touched).toBeTruthy();
    });
  });

  describe('Form Reset', () => {
    it('should reset the form and emit formReset event', () => {
      // Mock the formReset event
      const emitSpy = jest.spyOn(component.formReset, 'emit');

      // Simulate form reset
      component.onReset();

      expect(emitSpy).toHaveBeenCalled();
      expect(component.userForm.get('login')?.value).toBeNull();
      expect(component.userForm.get('email')?.value).toBeNull();
      expect(component.userForm.get('role')?.value).toBeNull();
    });
  });

  describe('ngOnChanges', () => {

    it('should update the form when initialData changes', () => {
      const newInitialData = {
        login: 'newuser',
        email: 'new@example.com',
        role: 'USER',
      };

      component.initialData = newInitialData;
      component.ngOnChanges({
        initialData: {
          currentValue: newInitialData,
          previousValue: mockInitialData,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.userForm.get('login')?.value).toBe(newInitialData.login);
      expect(component.userForm.get('email')?.value).toBe(newInitialData.email);
      expect(component.userForm.get('role')?.value).toBe(newInitialData.role);
    });

    it('should rebuild the form when fields change', () => {
      const newFields = [
        { name: 'fullname', label: 'Full Name', type: 'text', validators: [Validators.required] },
      ];

      component.fields = newFields;
      component.ngOnChanges({
        fields: {
          currentValue: newFields,
          previousValue: mockFields,
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.userForm.get('fullname')).toBeDefined();
      expect(component.userForm.get('login')).toBeNull();
      expect(component.userForm.get('email')).toBeNull();
      expect(component.userForm.get('role')).toBeNull();
    });
  
  });

});
