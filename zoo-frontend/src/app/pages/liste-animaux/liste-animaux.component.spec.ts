import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeAnimauxComponent } from './liste-animaux.component';

describe('ListeAnimauxComponent', () => {
  let component: ListeAnimauxComponent;
  let fixture: ComponentFixture<ListeAnimauxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeAnimauxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeAnimauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
