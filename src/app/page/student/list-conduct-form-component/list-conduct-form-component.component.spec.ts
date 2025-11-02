import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConductFormComponentComponent } from './list-conduct-form-component.component';

describe('ListConductFormComponentComponent', () => {
  let component: ListConductFormComponentComponent;
  let fixture: ComponentFixture<ListConductFormComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListConductFormComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListConductFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
