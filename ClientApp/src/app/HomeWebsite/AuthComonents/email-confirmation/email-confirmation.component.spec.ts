import { Location } from "@angular/common";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { RouterModule, UrlSegment } from "@angular/router";
import { byTestId, createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { MockService } from "ng-mocks";
import { Observable } from "rxjs";
import { AppModule } from "src/app/app.module";
import { DialogHandlerService } from "src/CommonServices/dialog-handler.service";
import { AuthRoutes } from "src/Helpers/router-constants";
import { AccountService } from "src/Services/account.service";
import { RoutesForHomeModule } from "../../home-website-routing.module";
import { EmailConfirmationComponent } from "./email-confirmation.component";

describe("EmailConfirmationComponent [UNIT TEST]", () =>
{
    let spectator: SpectatorRouting<EmailConfirmationComponent>;
    let successH1tag: HTMLElement | null;
    let failH1tag: HTMLHeadElement | null;
    let loginLink: HTMLAnchorElement | null;
    let failMessage: HTMLHeadingElement | null;
    let accountServiceMocks = MockService(AccountService);
    const createComponent = createRoutingFactory({
        component: EmailConfirmationComponent,
        imports: [RouterModule.forRoot(RoutesForHomeModule)],
        providers: [{ provide: AccountService, useValue: accountServiceMocks }],
        schemas: [NO_ERRORS_SCHEMA],
        stubsEnabled: false,
        shallow: false
    });
    beforeEach(() =>
    {
        spyOn(accountServiceMocks, "EmailConfirmations").and.returnValue(new Observable<any>());
        spectator = createComponent({ detectChanges: true });
    });
    describe("Sucess case", () =>
    {
        beforeEach(() =>
        {
            spectator.component.ngOnInit();
            spectator.component.Success = true;
            spectator.component.Fail = false;
            spectator.component.email = "fdfdfdfd@gkdfjskd.com";
            spectator.component.token = "ddfdfdfdfdfdfd";
            spectator.detectChanges();
            successH1tag = spectator.query(byTestId("success"));
            loginLink = spectator.query(byTestId("loginlink"));
        });
        it("finds h1 with title Email is confirmed successfully", () =>
        {
            expect(successH1tag?.tagName).toBe("H1");
            expect(successH1tag?.innerText).toEqual("Email is confirmed successfully");
        });
        it("ensure that h1 has classes alert and alert-sucess", () =>
        {
            expect(successH1tag).toHaveClass(['alert', 'alert-success']);
        });
        it("ensure that login link is found", () =>
        {
            expect(loginLink).toHaveAttribute("ng-reflect-router-link", "/login");
        });
    });
    describe("Failed case", () =>
    {
        beforeEach(() =>
        {
            spectator.component.ngOnInit();
            spectator.component.Success = false;
            spectator.component.Fail = true;
            spectator.component.email = "fdfdfdfd@gkdfjskd.com";
            spectator.component.token = "ddfdfdfdfdfdfd";
            spectator.detectChanges();
            successH1tag = spectator.query(byTestId("success"));
            failH1tag = spectator.query(byTestId("fail"));
            failMessage = spectator.query(byTestId("failMessage"));
        });
        it("finds h1 with title Email confirmation failed", () =>
        {
            spectator.component.Error = {
                status: "test",
                message: "Test message",
                data: null,
                tokenExpire: ""
            };
            expect(failH1tag?.tagName).toBe("H1");
            expect(failH1tag?.innerText).toEqual("Email confirmation failed");
        });
        it("ensure that h1 has classes alert and alert-danger", () =>
        {
            expect(failH1tag).toHaveClass(['alert', 'alert-danger']);
        });
        it("ensure that the error message is found", () =>
        {
            expect(failMessage).toExist();
            expect(failMessage).toHaveClass(['h3', 'alert']);
        });
    });
    describe("direction to homepage if the link doesn't contain email or token", () =>
    {
        it("redirect to '/' if no email or token", async () =>
        {
            // spectator.component.router.navigateByUrl("/" + AuthRoutes.emailConfirmation);
            spectator.component.ngOnInit();
            spectator.component.email = null;
            await spectator.fixture.whenStable();
            expect(spectator.inject(Location).path()).toBe("");
        });
    });
});