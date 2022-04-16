import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Update } from "@ngrx/entity";
import { Store } from "@ngrx/store";
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { GetServerErrorResponseService } from "src/CommonServices/getServerErrorResponse.service";
import { ServerResponseHandelerService } from "src/CommonServices/server-response-handeler.service";
import { SpinnerService } from "src/CommonServices/spinner.service";
import { PostsController } from "src/Helpers/apiconstants";
import { NotificationMessage, sweetAlert } from "src/Helpers/constants";
import { Category } from "src/models.model";
import { CategoryService } from "src/Services/category.service";
import { AddCATEGORY, AddCATEGORY_Failed, AddCATEGORY_Success, LoadCATEGORYs, LoadCATEGORYsFail, LoadCATEGORYsSuccess, RemoveCATEGORY, RemoveCATEGORY_Failed, RemoveCATEGORY_Success, UpdateCATEGORY, UpdateCATEGORY_Failed, UpdateCATEGORY_Sucess } from "./Category.actions";
import { selectAllCategorys } from "./Category.reducer";

@Injectable({
    providedIn: 'root'
})
export class CategoryEffects
{
    allCats = this.store.select(selectAllCategorys);
    allCategories: Category[] = [];
    constructor(private actions$: Actions, private ServerResponse: ServerResponseHandelerService,
        private ServerErrorResponse: GetServerErrorResponseService,
        private CategoryService: CategoryService, private store: Store,
        private spinner: SpinnerService)
    {
        this.allCats.subscribe(cats => this.allCategories = cats);
    }

    AddCategory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AddCATEGORY),
            switchMap((action) =>
            {
                this.spinner.InsideContainerSpinner();
                return this.CategoryService.Add(PostsController.AddCategory, action).pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Addition('Category'));

                        return AddCATEGORY_Success(r);
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Addition('Category'));

                        return of(AddCATEGORY_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
                    })
                );
            })
        )
    );
    UpdateCategory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UpdateCATEGORY),
            switchMap((action) =>
            {

                this.spinner.InsideContainerSpinner();
                return this.CategoryService.Update(PostsController.UpdateCategory, action).pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Update('Category'));
                        let parent = this.allCategories.find(c => c.id == action.parentKey);
                        let x: Update<Category> = {
                            id: action.id,
                            changes: action
                        };
                        if (action.level !== parent?.level)
                        {
                            this.ServerErrorResponse.updateCategoryLevelInStore(action);
                        }
                        return UpdateCATEGORY_Sucess({ CATEGORY: x });
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Update('Post'));
                        return of(UpdateCATEGORY_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
                    })
                );
            })
        )
    );

    GetCategories$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadCATEGORYs),
            withLatestFrom(this.store.select(selectAllCategorys)),
            switchMap(([action, categories]) =>
            {
                return this.CategoryService.GetAll(PostsController.GetAllCategories).pipe(
                    map((r) => LoadCATEGORYsSuccess({ payload: r })),
                    catchError((e) => of(LoadCATEGORYsFail({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) })))
                );
            }
            )
        )
    );
    RemoveCategory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RemoveCATEGORY),
            switchMap((action) =>
            {
                this.spinner.InsideContainerSpinner();
                return this.CategoryService.Delete(PostsController.DeleteCategory, action.id).pipe(
                    map((r) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GeneralSuccessResponse_Swal(r.message);
                        let children = this.allCategories.filter(c => c.parentKey == action.id);
                        let elTodelete = this.allCategories.find(c => c.id == action.id);
                        debugger;
                        for (let child of children)
                        {
                            let temp = Object.assign({}, child);
                            let childCopy: Category = { ...child, level: elTodelete?.level!, parentKey: elTodelete?.parentKey!, parent: elTodelete?.parent };
                            let Children_of_child = this.allCategories.filter(c => c.parentKey == temp.id);
                            for (let ch of Children_of_child)
                            {
                                let ch_of_Ch = new Category();
                                ch_of_Ch = { ...ch_of_Ch, level: childCopy?.level!, parent: childCopy };
                                this.ServerErrorResponse.updateCategoryLevelInStore(ch);
                            }
                            let x: Update<Category> = {
                                id: childCopy.id,
                                changes: childCopy
                            };
                            this.store.dispatch(UpdateCATEGORY_Sucess({ CATEGORY: x }));
                        }
                        return RemoveCATEGORY_Success({ id: action.id });
                    }),
                    catchError((e) =>
                    {
                        this.spinner.removeSpinner();
                        this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Delete('Post'));
                        return of(RemoveCATEGORY_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
                    })
                );
            })
        )
    );

}