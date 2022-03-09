import { RegisterPageComponent } from "./register-page.component";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MockComponent } from "ng-mocks";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { RegisterComponent } from "../AuthComonents/register/register.component";
describe("RegisterPageComponent", () =>
{
  let Spectator: Spectator<RegisterPageComponent>;
  const createComponent = createComponentFactory({
    component: RegisterPageComponent,
    declarations: [MockComponent(RegisterComponent)],
    schemas: [NO_ERRORS_SCHEMA],
    shallow: false
  });

  beforeEach(async () =>
  {
    Spectator = createComponent({
      detectChanges: true
    });
  });
  it("has app-login", () =>
  {
    let app_login = Spectator.query(RegisterComponent);
    expect(app_login).toBeTruthy();
  });
  it("has app-register with [CloseIconHide] attribute to be true", () =>
  {
    let app_login = Spectator.query(RegisterComponent);
    expect(app_login).toHaveProperty('CloseIconHide', true);
  });
  it("has app-register with [ShowCardFooter] attribute to be false", () =>
  {
    let app_login = Spectator.query(RegisterComponent);
    expect(app_login).toHaveProperty('ShowCardFooter', false);
  });
  it("has div element to center the app-register component", () =>
  {
    let div = Spectator.query('div');
    expect(div).toHaveClass(['d-flex', 'align-items-center', 'justify-content-center'], { strict: false });
  });
});