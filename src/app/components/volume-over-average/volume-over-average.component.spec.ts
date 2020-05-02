import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeOverAverageComponent } from './volume-over-average.component';

describe('VolumeOverAverageComponent', () => {
  let component: VolumeOverAverageComponent;
  let fixture: ComponentFixture<VolumeOverAverageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolumeOverAverageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeOverAverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
