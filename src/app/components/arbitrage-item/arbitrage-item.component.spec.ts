import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArbitrageItemComponent } from './arbitrage-item.component';

describe('ArbitrageItemComponent', () => {
  let component: ArbitrageItemComponent;
  let fixture: ComponentFixture<ArbitrageItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArbitrageItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArbitrageItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
