import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArbitrageItemNodeComponent } from './arbitrage-item-node.component';

describe('ArbitrageItemNodeComponent', () => {
  let component: ArbitrageItemNodeComponent;
  let fixture: ComponentFixture<ArbitrageItemNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArbitrageItemNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArbitrageItemNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
