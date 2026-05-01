import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
  
  describe('onRegister', () => {
    it('should navigate to "register" page', () => {
      const routerNavigateSpy = jest.spyOn(component['router'], 'navigateByUrl');
      component.onRegister();
      expect(routerNavigateSpy).toHaveBeenCalledWith('register');
    });
  });

  describe('onLogin', () => {
    it('should navigate to "login" page', () => {
      const routerNavigateSpy = jest.spyOn(component['router'], 'navigateByUrl');
      component.onLogin();
      expect(routerNavigateSpy).toHaveBeenCalledWith('login');
    });
  });
  
});
