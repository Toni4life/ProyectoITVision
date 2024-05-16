import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerceraFaseComponent } from './tercera-fase.component';

describe('TerceraFaseComponent', () => {
  let component: TerceraFaseComponent;
  let fixture: ComponentFixture<TerceraFaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerceraFaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TerceraFaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
