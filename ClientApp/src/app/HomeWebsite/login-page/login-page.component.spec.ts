import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LoginPageComponent } from "./login-page.component";

describe("LoginPageComponent", () =>
{
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async () =>
  {
    await TestBed.configureTestingModule({
      declarations: [LoginPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: []
    }).compileComponents();
  });

  beforeEach(() =>
  {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('method1', () =>
  {
    it('should contain app-login', () =>
    {
      expect(component).toBeTruthy();
    });
  });
});