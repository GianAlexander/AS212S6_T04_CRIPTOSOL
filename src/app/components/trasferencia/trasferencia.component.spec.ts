import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrasferenciaComponent } from './trasferencia.component';

describe('TrasferenciaComponent', () => {
  let component: TrasferenciaComponent;
  let fixture: ComponentFixture<TrasferenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrasferenciaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrasferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
