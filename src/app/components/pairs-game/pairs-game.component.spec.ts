import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PairsGameComponent } from './pairs-game.component';

describe('PairsGameComponent', () => {
  let component: PairsGameComponent;
  let fixture: ComponentFixture<PairsGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PairsGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PairsGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
