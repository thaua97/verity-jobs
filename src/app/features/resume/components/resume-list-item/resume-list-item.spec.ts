import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeListItem } from './resume-list-item';

describe('ResumeListItem', () => {
  let component: ResumeListItem;
  let fixture: ComponentFixture<ResumeListItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeListItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeListItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
