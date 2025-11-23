import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConductFormListComponent } from './conduct-form-list.component';

describe('ConductFormListComponent', () => {
  let component: ConductFormListComponent;
  let fixture: ComponentFixture<ConductFormListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConductFormListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConductFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
