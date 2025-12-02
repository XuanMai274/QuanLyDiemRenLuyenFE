import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageClassScoreComponent } from './average-class-score.component';

describe('AverageClassScoreComponent', () => {
  let component: AverageClassScoreComponent;
  let fixture: ComponentFixture<AverageClassScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AverageClassScoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AverageClassScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
