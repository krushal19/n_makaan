import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProperties } from './manage-properties';

describe('ManageProperties', () => {
  let component: ManageProperties;
  let fixture: ComponentFixture<ManageProperties>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageProperties]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageProperties);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
