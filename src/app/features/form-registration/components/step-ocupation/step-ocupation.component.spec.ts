import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepOcupationComponent } from './step-ocupation.component';

describe('StepOcupationComponent', () => {
  let component: StepOcupationComponent;
  let fixture: ComponentFixture<StepOcupationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepOcupationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepOcupationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
