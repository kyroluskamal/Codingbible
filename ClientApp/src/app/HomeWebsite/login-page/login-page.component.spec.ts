import { LoginPageComponent } from "./login-page.component";
import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { LoginComponent } from '../AuthComonents/login/login.component';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { MockComponent } from 'ng-mocks';
describe("LoginPageComponent", () =>
{
  let Spectator: SpectatorRouting<LoginPageComponent>;
  const createComponent = createRoutingFactory({
    component: LoginPageComponent,
    declarations: [MockComponent(LoginComponent)],
    schemas: [NO_ERRORS_SCHEMA],
    shallow: false
  });
  beforeEach(() =>
  {
    Spectator = createComponent({
      detectChanges: true
    });
  });
  it("has app-login", () =>
  {
    let app_login = Spectator.query(LoginComponent);
    expect(app_login).toBeTruthy();
  });
  it("has app-login with [CloseIconHide] attribute to be true", () =>
  {
    let app_login = Spectator.query(LoginComponent);
    expect(app_login).toHaveProperty('CloseIconHide', true);
  });
  it("has app-login with [ShowCardFooter] attribute to be false", () =>
  {
    let app_login = Spectator.query(LoginComponent);
    expect(app_login).toHaveProperty('ShowCardFooter', false);
  });
  it("has div element to center the app-login component", () =>
  {
    let div = Spectator.query('div');
    expect(div).toHaveClass(['d-flex', 'align-items-center', 'justify-content-center'], { strict: false });
  });

});