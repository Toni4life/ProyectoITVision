import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegundaFaseComponent } from './segunda-fase.component';

describe('SegundaFaseComponent', () => {
  let component: SegundaFaseComponent;
  let fixture: ComponentFixture<SegundaFaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SegundaFaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SegundaFaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
