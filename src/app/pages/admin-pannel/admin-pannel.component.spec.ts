import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPannelComponent } from './admin-pannel.component';

describe('AdminPannelComponent', () => {
  let component: AdminPannelComponent;
  let fixture: ComponentFixture<AdminPannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPannelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('onListUsers', () => {
    it('should navigate to "/crud/list-user" page', () => {
      const routerNavigateSpy = jest.spyOn(component['router'], 'navigateByUrl');
      component.onListUsers();
      expect(routerNavigateSpy).toHaveBeenCalledWith('/crud/list-user');
    });
  });

  describe('onCreateUser', () => {
    it('should navigate to "/crud/create-user" page', () => {
      const routerNavigateSpy = jest.spyOn(component['router'], 'navigateByUrl');
      component.onCreateUser();
      expect(routerNavigateSpy).toHaveBeenCalledWith('/crud/create-user');
    });
  });

  describe('onUpdateUser', () => {
    it('should navigate to "/crud/list-user" page', () => {
      const routerNavigateSpy = jest.spyOn(component['router'], 'navigateByUrl');
      component.onUpdateUser();
      expect(routerNavigateSpy).toHaveBeenCalledWith('/crud/list-user');
    });
  });

  describe('onDeleteUser', () => {
    it('should navigate to "/crud/list-user" page', () => {
      const routerNavigateSpy = jest.spyOn(component['router'], 'navigateByUrl');
      component.onDeleteUser();
      expect(routerNavigateSpy).toHaveBeenCalledWith('/crud/list-user');
    });  
  });   
});
