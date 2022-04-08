import { Overlay } from "@angular/cdk/overlay";
import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BrowserModule } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { Store, StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { MockComponent } from "ng-mocks";
import { metaReducers } from "src/app/app.module";
import { ClientSideValidationService } from "src/CommonServices/client-side-validation.service";
import { environment } from "src/environments/environment";
import { FormControlNames, FormValidationErrorsNames, PostType, validators } from "src/Helpers/constants";
import { click, findComponent, findEl_ByName, findEl_ByTestId, toTitleCase } from "src/Helpers/helper-functions";
import { PostService } from "src/Services/post.service";
import { AppReducers } from "src/State/app.state";
import { EditPostComponent } from "../edit-post/edit-post.component";
import { PostHandlerComponent } from "../post-handler/post-handler.component";
import { AddPostsComponent } from "./add-posts.component";

describe("AddPostsComponent", () =>
{
    describe("[UNIT TEST]", () =>
    {
        let spectator: SpectatorRouting<AddPostsComponent>;
        const createComponent = createRoutingFactory({
            component: AddPostsComponent,
            declarations: [MockComponent(PostHandlerComponent)],
            imports: [HttpClientModule, BrowserModule,
                StoreModule.forRoot(AppReducers, { metaReducers }), ReactiveFormsModule,
                StoreDevtoolsModule.instrument({ logOnly: environment.production }),],
            mocks: [ClientSideValidationService],
            providers: [FormBuilder, Store],
            shallow: false
        });
        beforeEach(() =>
        {
            spectator = createComponent({
                detectChanges: true
            });
            spectator.component.ngOnInit();

        });
        describe("PostHandlerComponent", () =>
        {
            let app_post_handler: PostHandlerComponent | null;
            beforeEach(() =>
            {
                app_post_handler = spectator.query<PostHandlerComponent>(PostHandlerComponent);
            });
            it("exist", () =>
            {
                expect(app_post_handler).toBeTruthy();
            });
            it("pass attribute of [inputForm]", () =>
            {
                expect(app_post_handler).toHaveProperty("inputForm");
                // expect(app_post_handler?.inputForm).toEqual(spectator.component.form);
            });
            it("pass attribute of [postType] with value Add", () =>
            {
                expect(app_post_handler).toHaveProperty("postType", PostType.Add);
            });
            describe("Events emitted", () =>
            {
                let app_post_handler: PostHandlerComponent | null;
                beforeEach(() =>
                {
                    app_post_handler = spectator.query<PostHandlerComponent>(PostHandlerComponent);
                });
                it("repsonds to Draft event", () =>
                {
                    let form = new FormGroup({
                        title: new FormControl("This is test title", [validators.required, validators.SEO_TITLE_MIN_LENGTH, validators.SEO_TITLE_MAX_LENGTH]),
                        slug: new FormControl("This-is-test-title"),
                        excerpt: new FormControl("This is excerpt", [validators.required]),
                        description: new FormControl("This is description This is description This is description This is description ", [validators.required, validators.SEO_DESCRIPTION_MIN_LENGTH, validators.SEO_DESCRIPTION_MAX_LENGTH]),
                        htmlContent: new FormControl("This is description This is description This is description This is description ", [validators.required])
                    });
                    spectator.triggerEventHandler("app-post-handler", "Draft", form);
                    expect(spectator.component.newPost.slug).toBe(form.get("slug")?.value);
                    expect(spectator.component.newPost.status).toBe(0);
                });
                it("repsonds to Publish event", () =>
                {
                    let form = new FormGroup({
                        title: new FormControl("This is test title", [validators.required, validators.SEO_TITLE_MIN_LENGTH, validators.SEO_TITLE_MAX_LENGTH]),
                        slug: new FormControl("This-is-test-title"),
                        excerpt: new FormControl("This is excerpt", [validators.required]),
                        description: new FormControl("This is description This is description This is description This is description ", [validators.required, validators.SEO_DESCRIPTION_MIN_LENGTH, validators.SEO_DESCRIPTION_MAX_LENGTH]),
                        htmlContent: new FormControl("This is description This is description This is description This is description ", [validators.required])
                    });
                    spectator.triggerEventHandler("app-post-handler", "Publish", form);
                    expect(spectator.component.newPost.slug).toBe(form.get("slug")?.value);
                    expect(spectator.component.newPost.status).toBe(1);
                });
            });
        });
        describe("AddPostForm testing", () =>
        {
            describe(`${toTitleCase(FormControlNames.postForm.title)}`, () =>
            {
                it(`exists`, () =>
                {
                    expect(spectator.component.form.get(FormControlNames.postForm.title)).toExist();
                });
                it(`has required validator`, () =>
                {
                    expect(spectator.component.form.get(FormControlNames.postForm.title)?.hasValidator(validators.required)).toBeTrue();
                });
                it(`has minlength 60 validator`, () =>
                {
                    expect(spectator.component.form.get(FormControlNames.postForm.title)?.hasValidator(validators.SEO_TITLE_MIN_LENGTH)).toBeTrue();
                });
                it(`has maxlength 70 validator`, () =>
                {
                    expect(spectator.component.form.get(FormControlNames.postForm.title)?.hasValidator(validators.SEO_TITLE_MAX_LENGTH)).toBeTrue();
                });
                it(`sets form invalid if title is less than 60 and more than 70`, () =>
                {
                    spectator.component.form.get(FormControlNames.postForm.title)?.setValue("dfdfdfdfd");
                    spectator.component.form.get(FormControlNames.postForm.htmlContent)?.setValue("dfdfdfdfd");
                    spectator.component.form.get(FormControlNames.postForm.excerpt)?.setValue("dfdfdfdfd");
                    spectator.component.form.get(FormControlNames.postForm.description)?.setValue("dllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllfdfdfdfd");
                    expect(spectator.component.form.get(FormControlNames.postForm.title)?.hasError(FormValidationErrorsNames.minlength)).toBeTrue();
                    expect(spectator.component.form.get(FormControlNames.postForm.htmlContent)?.errors).toEqual(null);
                    expect(spectator.component.form.get(FormControlNames.postForm.excerpt)?.errors).toEqual(null);
                    expect(spectator.component.form.get(FormControlNames.postForm.description)?.errors).toEqual(null);
                    expect(spectator.component.form.invalid).toBeTrue();
                    spectator.component.form.get(FormControlNames.postForm.title)?.setValue("dfdfddfdfddfdfddfdfddfdfddfdfddfdfddfdfddfdfddfdfddfdfddfdfddfdfddfdfddfdfd");
                    expect(spectator.component.form.get(FormControlNames.postForm.title)?.hasError(FormValidationErrorsNames.maxlength)).toBeTrue();
                    expect(spectator.component.form.invalid).toBeTrue();
                    spectator.component.form.get(FormControlNames.postForm.title)?.setValue("dfdfddfdfddfdfddfdfddfdfddfdfddfdfddfdfddfdfddfdfddfdfddfdfddfd");
                    expect(spectator.component.form.get(FormControlNames.postForm.title)?.errors).toEqual(null);
                    expect(spectator.component.form.valid).toBeTrue();

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
                    expect(spectator.component.form.get(FormControlNames.postForm.description)?.hasValidator(validators.SEO_DESCRIPTION_MIN_LENGTH)).toBeTrue();
                });
                it(`has max length 160 validator`, () =>
                {
                    expect(spectator.component.form.get(FormControlNames.postForm.description)?.hasValidator(validators.SEO_DESCRIPTION_MAX_LENGTH)).toBeTrue();
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
    describe("[INTEGRATION TEST with PostHandlerComponent]", () =>
    {
        let spectator: SpectatorRouting<AddPostsComponent>;
        let postHandler: DebugElement;
        let title: DebugElement;
        let slug: DebugElement;
        let view: DebugElement;
        let htmlContent: DebugElement;
        let description: DebugElement;
        let excerpt: DebugElement;
        const createComponent = createRoutingFactory({
            component: AddPostsComponent,
            imports: [HttpClientModule, BrowserModule,
                StoreModule.forRoot(AppReducers, { metaReducers }), ReactiveFormsModule,
                StoreDevtoolsModule.instrument({ logOnly: environment.production })],
            declarations: [PostHandlerComponent, EditPostComponent],
            mocks: [PostService, MatDialog],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            stubsEnabled: false,
            providers: [FormBuilder, ActivatedRoute, Store, MatSnackBar, ClientSideValidationService, Overlay],
            shallow: false
        });
        beforeEach(() =>
        {
            spectator = createComponent({
                detectChanges: true
            });
            spectator.component.ngOnInit();

            postHandler = findComponent(spectator.fixture, "app-post-handler");
            title = findEl_ByName(spectator.fixture, FormControlNames.postForm.title);
            title.nativeElement.value = "This is title";
            title.nativeElement.dispatchEvent(new Event("input"));
            slug = findEl_ByTestId(spectator.fixture, FormControlNames.postForm.slug);
            view = findEl_ByTestId(spectator.fixture, "view");
            view.nativeElement.innerHTML = "<i>This is content</i>";
            view.nativeElement.dispatchEvent(new Event("input"));
            htmlContent = findEl_ByName(spectator.fixture, FormControlNames.postForm.htmlContent);
            description = findEl_ByName(spectator.fixture, FormControlNames.postForm.description);
            description.nativeElement.dispatchEvent(new Event("input"));
            excerpt = findEl_ByName(spectator.fixture, FormControlNames.postForm.excerpt);
            excerpt.nativeElement.dispatchEvent(new Event("input"));
        });
        describe("Check Draft event", () =>
        {
            it("checks AddPostComponent.newPost === the form filled from the PostHandlerComponent", () =>
            {
                click(spectator.fixture, "DraftBtn", undefined);
                expect(spectator.component.newPost.title).toBe(title.nativeElement.value);
                expect(spectator.component.newPost.slug).toBe(slug.nativeElement.value);
                expect(spectator.component.newPost.htmlContent).toBe(htmlContent.nativeElement.value);
                expect(spectator.component.newPost.description).toBe(description.nativeElement.value);
                expect(spectator.component.newPost.excerpt).toBe(excerpt.nativeElement.value);
            });
            it("ensure that the newPost.status === Draft", () =>
            {
                click(spectator.fixture, "DraftBtn", undefined);
                expect(spectator.component.newPost.status).toBe(0);
            });
        });
        describe("Check Publish event", () =>
        {
            it("checks AddPostComponent.newPost === the form filled from the PostHandlerComponent", () =>
            {
                click(spectator.fixture, "PublishBtn", undefined);
                expect(spectator.component.newPost.title).toBe(title.nativeElement.value);
                expect(spectator.component.newPost.slug).toBe(slug.nativeElement.value);
                expect(spectator.component.newPost.htmlContent).toBe(htmlContent.nativeElement.value);
                expect(spectator.component.newPost.description).toBe(description.nativeElement.value);
                expect(spectator.component.newPost.excerpt).toBe(excerpt.nativeElement.value);
            });
            it("ensure that the newPost.status === Publish", () =>
            {
                click(spectator.fixture, "PublishBtn", undefined);
                expect(spectator.component.newPost.status).toBe(1);
            });
        });
    });
});