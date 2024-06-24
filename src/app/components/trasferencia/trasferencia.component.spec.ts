import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { TrasferenciaComponent } from './trasferencia.component';

describe('TrasferenciaComponent', () => {
  let component: TrasferenciaComponent;
  let fixture: ComponentFixture<TrasferenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrasferenciaComponent ],
      imports: [ FormsModule ] // Asegúrate de importar FormsModule aquí si es necesario
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrasferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
