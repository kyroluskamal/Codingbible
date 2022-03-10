import { byTestId, createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { AppModule } from "src/app/app.module";
import { EmailConfirmationComponent } from "./email-confirmation.component";

describe("EmailConfirmationComponent", () =>
{
    let spectator: SpectatorRouting<EmailConfirmationComponent>;
    let successH1tag: HTMLElement | null;
    let failH1tag: HTMLHeadElement | null;
    let loginLink: HTMLAnchorElement | null;
    let errorMessageH3Tag: HTMLHeadingElement | null;

    const createComponent = createRoutingFactory({
        component: EmailConfirmationComponent,
        imports: [AppModule]
    });
    beforeEach(() =>
    {
        spectator = createComponent({ detectChanges: true });
    });
    describe("Sucess case", () =>
    {
        beforeEach(() =>
        {
            spectator.component.Success = true;
            spectator.component.Fail = false;
            spectator.detectChanges();
            successH1tag = spectator.query(byTestId("success"));
            loginLink = spectator.query(byTestId("loginlink"));
        });
        it("finds h1 with title Email is confirmed successfully", () =>
        {
            expect(successH1tag?.tagName).toBe("H1");
            expect(successH1tag?.innerText).toEqual("Email is confirmed successfully");
        });
        it("ensure that h1 has classes alert and alert-danger", () =>
        {
            expect(successH1tag).toHaveClass(['alert', 'alert-success']);
        });
        it("ensure that login link is found", () =>
        {
            expect(loginLink).toHaveAttribute("ng-reflect-router-link", "/login");
        });
    });
});