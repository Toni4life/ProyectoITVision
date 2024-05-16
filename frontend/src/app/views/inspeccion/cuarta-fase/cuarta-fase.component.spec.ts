import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuartaFaseComponent } from './cuarta-fase.component';

describe('CuartaFaseComponent', () => {
  let component: CuartaFaseComponent;
  let fixture: ComponentFixture<CuartaFaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuartaFaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CuartaFaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
