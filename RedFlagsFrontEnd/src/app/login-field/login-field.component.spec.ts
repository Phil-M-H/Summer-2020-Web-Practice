import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFieldComponent } from './login-field.component';

describe('LoginFieldComponent', () => {
  let component: LoginFieldComponent;
  let fixture: ComponentFixture<LoginFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
