import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalFaseComponent } from './final-fase.component';

describe('FinalFaseComponent', () => {
  let component: FinalFaseComponent;
  let fixture: ComponentFixture<FinalFaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalFaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinalFaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
