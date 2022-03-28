import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { DialogHandlerService } from 'src/CommonServices/dialog-handler.service';
import { GetServerErrorResponseService } from 'src/CommonServices/getServerErrorResponse.service';
import { ServerResponseHandelerService } from 'src/CommonServices/server-response-handeler.service';
import { SpinnerService } from 'src/CommonServices/spinner.service';
import { PostService } from 'src/Services/post.service';
import { dummyAction, GetPostById, GetPostById_Failed, GetPostById_Success, LoadPOSTs, LoadPOSTsFail, LoadPOSTsSuccess } from './post.actions';
import { selectAllposts } from './post.reducer';

@Injectable({
  providedIn: 'root'
})
export class PostEffectForHome
{

  constructor(private actions$: Actions, private ServerResponse: GetServerErrorResponseService,
    private postService: PostService, private store: Store,
  ) { }

  GetPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadPOSTs),
      withLatestFrom(this.store.select(selectAllposts)),
      switchMap(([action, posts]) =>
      {
        if (posts.length == 0)
          return this.postService.getAllPosts().pipe(
            map((r) => LoadPOSTsSuccess({ payload: r })),
            catchError((e) => of(LoadPOSTsFail({ error: e, validationErrors: this.ServerResponse.GetServerSideValidationErrors(e) })))
          );
        return of(dummyAction());
      }
      )
    )
  );

  GetPostById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GetPostById),
      switchMap((action) =>
        this.postService.GetPostById(action.id).pipe(
          map((r) => GetPostById_Success(r)),
          catchError((e) => of(GetPostById_Failed({ error: e, validationErrors: this.ServerResponse.GetServerSideValidationErrors(e) })))
        )
      )
    )
  );
}
