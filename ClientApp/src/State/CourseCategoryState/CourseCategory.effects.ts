import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Update } from "@ngrx/entity";
import { Store } from "@ngrx/store";
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { GetServerErrorResponseService } from "src/CommonServices/getServerErrorResponse.service";
import { ServerResponseHandelerService } from "src/CommonServices/server-response-handeler.service";
import { SpinnerService } from "src/CommonServices/spinner.service";
import { CoursesController } from "src/Helpers/apiconstants";
import { NotificationMessage, sweetAlert } from "src/Helpers/constants";
import { CourseCategory } from "src/models.model";
import { CourseCategoryService } from "src/Services/course-category.service";
import { AddCourseCategory, AddCourseCategory_Failed, AddCourseCategory_Success, dummyAction, LoadCourseCategorys, LoadCourseCategorysFail, LoadCourseCategorysSuccess, RemoveCourseCategory, RemoveCourseCategory_Failed, RemoveCourseCategory_Success, SetValidationErrors, UpdateCourseCategory, UpdateCourseCategory_Failed, UpdateCourseCategory_Sucess } from "./CourseCategory.actions";
import { selectAllCourseCategorys } from "./CourseCategory.reducer";

@Injectable({
    providedIn: 'root'
})
export class CourseCategoryEffects
{
    allCats = this.store.select(selectAllCourseCategorys);
    allCategories: CourseCategory[] = [];
    constructor(private actions$: Actions, private ServerResponse: ServerResponseHandelerService,
        private ServerErrorResponse: GetServerErrorResponseService,
        private CourseCategoryService: CourseCategoryService, private store: Store,
        private spinner: SpinnerService)
    {
        this.allCats.subscribe(cats => this.allCategories = cats);
    }

    AddCategory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AddCourseCategory),
            switchMap((action) =>
            {
                this.spinner.InsideContainerSpinner();
                return this.CourseCategoryService.Add(CoursesController.AddCategory, action).pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Addition('Category'));
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                        return AddCourseCategory_Success(r);
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Addition('Category'));

                        return of(AddCourseCategory_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
                    })
                );
            })
        )
    );
    UpdateCategory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UpdateCourseCategory),
            switchMap((action) =>
            {
                this.spinner.InsideContainerSpinner();
                return this.CourseCategoryService.Update(CoursesController.UpdateCategory, action).pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Update('Category'));
                        let parent = this.allCategories.find(c => c.id == action.parentKey);
                        let x: Update<CourseCategory> = {
                            id: action.id,
                            changes: action
                        };
                        if (action.level !== parent?.level)
                        {
                            this.ServerErrorResponse.updateCategoryLevelInCourses(action);
                        }
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                        return UpdateCourseCategory_Sucess({ CourseCategory: x });
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Update('Couese Category'));
                        return of(UpdateCourseCategory_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
                    })
                );
            })
        )
    );

    GetCategories$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadCourseCategorys),
            withLatestFrom(this.store.select(selectAllCourseCategorys)),
            switchMap(([action, categories]) =>
            {
                if (categories.length === 0)
                    return this.CourseCategoryService.GetAll(CoursesController.GetAllCategories).pipe(
                        map((r) =>
                        {
                            this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                            return LoadCourseCategorysSuccess({ payload: r });
                        }
                        ),
                        catchError((e) => of(LoadCourseCategorysFail({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) })))
                    );
                else
                    return of(dummyAction());
            }
            )
        )
    );
    RemoveCategory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RemoveCourseCategory),
            switchMap((action) =>
            {
                this.spinner.fullScreenSpinner();
                return this.CourseCategoryService.Delete(CoursesController.DeleteCategory, action.id).pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(r.message);
                        let children = this.allCategories.filter(c => c.parentKey == action.id);
                        let elTodelete = this.allCategories.find(c => c.id == action.id);
                        for (let child of children)
                        {
                            let temp = Object.assign({}, child);
                            let childCopy: CourseCategory = { ...child, level: elTodelete?.level!, parentKey: elTodelete?.parentKey!, parent: elTodelete?.parent! };
                            let Children_of_child = this.allCategories.filter(c => c.parentKey == temp.id);
                            for (let ch of Children_of_child)
                            {
                                let ch_of_Ch = new CourseCategory();
                                ch_of_Ch = { ...ch_of_Ch, level: childCopy?.level!, parent: childCopy };
                                this.ServerErrorResponse.updateCategoryLevelInCourses(ch);
                            }
                            let x: Update<CourseCategory> = {
                                id: childCopy.id,
                                changes: childCopy
                            };
                            this.store.dispatch(UpdateCourseCategory_Sucess({ CourseCategory: x }));
                        }
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                        return RemoveCourseCategory_Success({ id: action.id });
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Delete('Course category'));
                        return of(RemoveCourseCategory_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
                    })
                );
            })
        )
    );

}