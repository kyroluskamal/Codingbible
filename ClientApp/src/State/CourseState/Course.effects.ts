import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, map, of, switchMap, withLatestFrom } from "rxjs";
import { GetServerErrorResponseService } from "src/CommonServices/getServerErrorResponse.service";
import { ServerResponseHandelerService } from "src/CommonServices/server-response-handeler.service";
import { SpinnerService } from "src/CommonServices/spinner.service";
import { CoursesController } from "src/Helpers/apiconstants";
import { CourseService } from "src/Services/course.service";
import { dummyAction, LoadCourses, LoadCoursesFail, LoadCoursesSuccess, SetValidationErrors } from "./course.actions";
import { selectAllCourses } from "./course.reducer";

@Injectable({
    providedIn: 'root'
})
export class CoursesEffects
{

    constructor(private actions$: Actions, private ServerResponse: ServerResponseHandelerService,
        private ServerErrorResponse: GetServerErrorResponseService,
        private CourseService: CourseService, private store: Store,
        private router: Router, private spinner: SpinnerService) { }

    GetAllCourses$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadCourses),
            withLatestFrom(this.store.select(selectAllCourses)),
            switchMap(([action, Courses]) =>
            {
                if (Courses.length == 0)
                    return this.CourseService.GetAll(CoursesController.GetAllCourses).pipe(
                        map((r) =>
                        {
                            this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
                            return LoadCoursesSuccess({ payload: r });
                        }),
                        catchError((e) => of(LoadCoursesFail({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) })))
                    );
                return of(dummyAction());
            })
        )
    );
}