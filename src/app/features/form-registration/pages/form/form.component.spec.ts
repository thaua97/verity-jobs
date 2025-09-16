import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRegistrationShellComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormRegistrationShellComponent;
  let fixture: ComponentFixture<FormRegistrationShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormRegistrationShellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRegistrationShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
