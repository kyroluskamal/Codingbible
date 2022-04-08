
import { FormBuilder } from "@angular/forms";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MockComponent } from "ng-mocks";
import { FormControlNames, PostType, validators } from "src/Helpers/constants";
import { toTitleCase } from "src/Helpers/helper-functions";
import { PostHandlerComponent } from "../post-handler/post-handler.component";
import { EditPostComponent } from "./edit-post.component";

describe("EditPostComponent", () =>
{
    describe("[UNIT TEST]", () =>
    {
        let spectator: Spectator<EditPostComponent>;
        const createComponent = createComponentFactory({
            component: EditPostComponent,
            declarations: [MockComponent(PostHandlerComponent)],
            providers: [FormBuilder],
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
            });
            it("pass attribute of [postType] with value Add", () =>
            {
                expect(app_post_handler).toHaveProperty("postType", PostType.Edit);
            });
        });
        describe("EditPostForm testing", () =>
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
                    expect(spectator.component.form.get(FormControlNames.postForm.title)?.hasValidator(validators.SEO_TITLE_MIN_LENGTH)).toBeTrue();
                });
                it(`has min length 70`, () =>
                {
                    expect(spectator.component.form.get(FormControlNames.postForm.title)?.hasValidator(validators.SEO_TITLE_MAX_LENGTH)).toBeTrue();
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
});