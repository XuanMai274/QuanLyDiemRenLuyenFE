import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseFeedbackComponent } from './response-feedback.component';

describe('ResponseFeedbackComponent', () => {
  let component: ResponseFeedbackComponent;
  let fixture: ComponentFixture<ResponseFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponseFeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponseFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
