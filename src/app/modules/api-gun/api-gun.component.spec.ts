import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiGunComponent } from './api-gun.component';

describe('ApiGunComponent', () => {
  let component: ApiGunComponent;
  let fixture: ComponentFixture<ApiGunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiGunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiGunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
