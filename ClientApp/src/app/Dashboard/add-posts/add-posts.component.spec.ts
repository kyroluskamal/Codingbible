import { HttpClient } from "@angular/common/http";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { byTestId, createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { EffectsModule } from "@ngrx/effects";
import { Store, StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { AppModule, metaReducers } from "src/app/app.module";
import { ClientSideValidationService } from "src/CommonServices/client-side-validation.service";
import { environment } from "src/environments/environment";
import { FormControlNames, validators } from "src/Helpers/constants";
import { spectatorSelectByControlName, toTitleCase } from "src/Helpers/helper-functions";
import { AppReducers } from "src/State/app.state";
import { AuthEffects } from "src/State/AuthState/auth.effects";
import { PostEffects } from "src/State/PostState/post-effects";
import { AddPostsComponent } from "./add-posts.component";

describe("AddPostsComponent [UNIT TEST]", () =>
{
    let titleInput: HTMLInputElement | null;
    let slugInput: HTMLInputElement | null;
    let descriptionInput: HTMLInputElement | null;
    let excerptInput: HTMLInputElement | null;
    let spectator: SpectatorRouting<AddPostsComponent>;
    const createComponent = createRoutingFactory({
        component: AddPostsComponent,
        imports: [
            StoreModule.forRoot(AppReducers, { metaReducers }), ReactiveFormsModule,
            StoreDevtoolsModule.instrument({ logOnly: environment.production }),],
        mocks: [ClientSideValidationService],
        providers: [FormBuilder, Store],
        shallow: true
    });
    beforeEach(() =>
    {
        spectator = createComponent({
            detectChanges: true
        });
        spectator.component.ngOnInit();
        titleInput = <HTMLInputElement>spectatorSelectByControlName<AddPostsComponent>(spectator, FormControlNames.postForm.title);
        descriptionInput = <HTMLInputElement>spectatorSelectByControlName<AddPostsComponent>(spectator, FormControlNames.postForm.description);
        excerptInput = <HTMLInputElement>spectatorSelectByControlName<AddPostsComponent>(spectator, FormControlNames.postForm.excerpt);
    });
    describe("Client Side Validation", () =>
    {
        describe("AddPostForm testing", () =>
        {
            describe(`${toTitleCase(FormControlNames.postForm.title)}`, () =>
            {
                it(`exists`, () =>
                {
                    expect(spectator.component.form.get(FormControlNames.postForm.title)).toExist();
                });
                it(`is required`, () =>
                {
                    expect(spectator.component.form.get(FormControlNames.postForm.title)?.hasValidator(validators.required)).toBeTrue();
                });
                it(`has min length 60`, () =>
                {
                    expect(spectator.component.form.get(FormControlNames.postForm.title)?.hasValidator(validators.POST_TITLE_MIN_LENGTH)).toBeTrue();
                });
                it(`has min length 70`, () =>
                {
                    expect(spectator.component.form.get(FormControlNames.postForm.title)?.hasValidator(validators.POST_TITLE_MAX_LENGTH)).toBeTrue();
                });
            });
            describe(`${toTitleCase(FormControlNames.postForm.description)}`, () =>
            {
                it(`exists`, () =>
                {
                    expect(spectator.component.form.get(FormControlNames.postForm.description)).toExist();
                });
                it(`is required`, () =>
                {
                    expect(spectator.component.form.get(FormControlNames.postForm.description)?.hasValidator(validators.required)).toBeTrue();
                });
                it(`has min length 50 validator`, () =>
                {
                    expect(spectator.component.form.get(FormControlNames.postForm.description)?.hasValidator(validators.POST_DESCRIPTION_MIN_LENGTH)).toBeTrue();
                });
                it(`has max length 160 validator`, () =>
                {
                    expect(spectator.component.form.get(FormControlNames.postForm.description)?.hasValidator(validators.POST_DESCRIPTION_MAX_LENGTH)).toBeTrue();
                });
            });
            describe(toTitleCase(FormControlNames.postForm.excerpt), () =>
            {
                it(`exists`, () =>
                {
                    expect(spectator.component.form.get(FormControlNames.postForm.excerpt)).toExist();
                });
                it(`is required`, () =>
                {
                    expect(spectator.component.form.get(FormControlNames.postForm.excerpt)?.hasValidator(validators.required)).toBeTrue();
                });
            });
        });
    });
});