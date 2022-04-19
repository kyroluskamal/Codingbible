import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { GetServerErrorResponseService } from 'src/CommonServices/getServerErrorResponse.service';
import { ServerResponseHandelerService } from 'src/CommonServices/server-response-handeler.service';
import { SpinnerService } from 'src/CommonServices/spinner.service';
import { NotificationMessage, sweetAlert } from 'src/Helpers/constants';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { Post, PostsCategory } from 'src/models.model';
import { PostService } from 'src/Services/post.service';
import { AddPOST, AddPOST_Failed, AddPOST_Success, ChangeStatus, ChangeStatus_Failed, ChangeStatus_Success, dummyAction, GetPostById, GetPostById_Failed, GetPostById_Success, LoadPOSTs, LoadPOSTsFail, LoadPOSTsSuccess, RemovePOST, RemovePOST_Failed, RemovePOST_Success, SetValidationErrors, UpdatePOST, UpdatePOST_Failed, UpdatePOST_Sucess } from './post.actions';
import { selectAllposts } from './post.reducer';

@Injectable({
  providedIn: 'root'
})
export class PostEffects
{

  constructor(private actions$: Actions, private ServerResponse: ServerResponseHandelerService,
    private ServerErrorResponse: GetServerErrorResponseService,
    private postService: PostService, private store: Store,
    private router: Router, private spinner: SpinnerService) { }

  AddPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddPOST),
      switchMap((action) =>
      {
        this.spinner.fullScreenSpinner();
        return this.postService.AddPost(action).pipe(
          map((r) =>
          {
            this.spinner.removeSpinner();
            this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Addition('Post'));
            this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
            this.router.navigate(['', DashboardRoutes.Home, DashboardRoutes.Posts.Home, DashboardRoutes.Posts.EditPost], { queryParams: { id: r.id } });
            return AddPOST_Success(r);
          }),
          catchError((e) =>
          {
            this.spinner.removeSpinner();
            return of(AddPOST_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
          })
        );
      })
    )
  );
  UpdatePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UpdatePOST),
      switchMap((action) =>
      {
        this.spinner.fullScreenSpinner();
        return this.postService.UpdatePost(action).pipe(
          map((r) =>
          {
            console.log(r);
            this.spinner.removeSpinner();
            this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Update('Post'));
            let x: Update<Post> = {
              id: action.id,
              changes: r.data as Post
            };
            this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
            return UpdatePOST_Sucess({ POST: x });
          }),
          catchError((e) =>
          {
            this.spinner.removeSpinner();
            this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Update('Post'));
            return of(UpdatePOST_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
          })
        );
      })
    )
  );
  changeStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChangeStatus),
      switchMap((action) =>
      {
        return this.postService.ChangeStus(action).pipe(
          map((r) =>
          {
            this.spinner.removeSpinner();
            this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Update('Post status'));
            let x: Update<Post> = {
              id: action.id,
              changes: action
            };
            this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
            return ChangeStatus_Success({ POST: x, currentPostById: action });
          }),
          catchError((e) =>
          {
            this.spinner.removeSpinner();
            this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Update('Post status'));
            return of(ChangeStatus_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
          })
        );
      })
    )
  );
  GetPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadPOSTs),
      withLatestFrom(this.store.select(selectAllposts)),
      switchMap(([action, posts]) =>
      {
        if (posts.length == 0)
          return this.postService.getAllPosts().pipe(
            map((r) =>
            {
              this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
              return LoadPOSTsSuccess({ payload: r });
            }),
            catchError((e) => of(LoadPOSTsFail({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) })))
          );
        return of(dummyAction());
      }
      )
    )
  );
  RemovePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RemovePOST),
      switchMap((action) =>
      {
        this.spinner.fullScreenSpinner();
        return this.postService.DeletePost(action.id).pipe(
          map((r) =>
          {
            this.spinner.removeSpinner();
            this.ServerResponse.GeneralSuccessResponse_Swal(NotificationMessage.Success.Delete('Post'));
            if (action.url === DashboardRoutes.Posts.EditPost)
              this.router.navigate(['', DashboardRoutes.Home]);
            this.store.dispatch(SetValidationErrors({ validationErrors: [] }));

            return RemovePOST_Success({ id: action.id });
          }),
          catchError((e) =>
          {
            this.spinner.removeSpinner();
            this.ServerResponse.GetGeneralError_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, NotificationMessage.Error.Delete('Post'));
            return of(RemovePOST_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) }));
          })
        );
      })
    )
  );
  GetPostById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GetPostById),
      switchMap((action) =>
        this.postService.GetPostById(action.id).pipe(
          map((r) =>
          {
            this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
            return GetPostById_Success(r);
          }),
          catchError((e) => of(GetPostById_Failed({ error: e, validationErrors: this.ServerErrorResponse.GetServerSideValidationErrors(e) })))
        )
      )
    )
  );
}
