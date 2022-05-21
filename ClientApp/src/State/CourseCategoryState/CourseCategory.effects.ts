import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
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
                        if (e.error.message && e.error.message.toLowerCase().includes('unique'))
                            this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, e.error.message);
                        else
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
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                        return LoadCourseCategorys();
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        if (e.error.message && e.error.message.toLowerCase().includes('unique'))
                            this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, e.error.message);
                        else
                            this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Addition('Category'));
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
                return this.CourseCategoryService.GetAll(CoursesController.GetAllCategories).pipe(
                    map((r) =>
                    {
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                        return LoadCourseCategorysSuccess({ payload: r });
                    }),
                    catchError((e) => of(LoadCourseCategorysFail({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) })))
                );
            })
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
                        debugger;
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(r.message);
                        this.store.dispatch(SetValidationErrors({ validationErrors: [] }));

                        return LoadCourseCategorys();
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