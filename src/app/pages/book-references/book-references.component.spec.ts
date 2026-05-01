import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookReferencesComponent } from './book-references.component';

describe('BookReferencesComponent', () => {
  let component: BookReferencesComponent;
  let fixture: ComponentFixture<BookReferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookReferencesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
  
  describe('onBackHome', () => {
    it('should navigate to home page', () => {
      const routerNavigateSpy = jest.spyOn(component['router'], 'navigateByUrl');
      component.onBackHome();
      expect(routerNavigateSpy).toHaveBeenCalledWith('');
    });
  });
  
});
