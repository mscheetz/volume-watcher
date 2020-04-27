import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomResponseComponent } from './custom-response.component';

describe('CustomResponseComponent', () => {
  let component: CustomResponseComponent;
  let fixture: ComponentFixture<CustomResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
