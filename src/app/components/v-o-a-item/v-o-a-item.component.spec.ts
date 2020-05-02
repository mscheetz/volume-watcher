import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VOAItemComponent } from './v-o-a-item.component';

describe('VOAItemComponent', () => {
  let component: VOAItemComponent;
  let fixture: ComponentFixture<VOAItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VOAItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VOAItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
