import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemesterDialogComponent } from './semester-dialog.component';

describe('SemesterDialogComponent', () => {
  let component: SemesterDialogComponent;
  let fixture: ComponentFixture<SemesterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemesterDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SemesterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
