import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepLocationComponent } from './step-location.component';

describe('StepLocationComponent', () => {
  let component: StepLocationComponent;
  let fixture: ComponentFixture<StepLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepLocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
