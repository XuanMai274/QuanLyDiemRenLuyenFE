import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConductFormDetailComponent } from './conduct-form-detail.component';

describe('ConductFormDetailComponent', () => {
  let component: ConductFormDetailComponent;
  let fixture: ComponentFixture<ConductFormDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConductFormDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConductFormDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
