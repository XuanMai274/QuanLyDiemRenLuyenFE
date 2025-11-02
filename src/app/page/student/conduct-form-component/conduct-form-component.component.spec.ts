import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConductFormComponentComponent } from './conduct-form-component.component';

describe('ConductFormComponentComponent', () => {
  let component: ConductFormComponentComponent;
  let fixture: ComponentFixture<ConductFormComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConductFormComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConductFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
