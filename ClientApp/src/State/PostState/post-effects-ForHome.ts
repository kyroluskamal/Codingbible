import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, switchMap, withLatestFrom } from 'rxjs';
import { GetServerErrorResponseService } from 'src/CommonServices/getServerErrorResponse.service';
import { AccountService } from 'src/Services/account.service';
import { PostService } from 'src/Services/post.service';
import { Logout, LogoutCancelled, LogoutConfirmed } from '../AuthState/auth.actions';
import { dummyAction, GetPostById, GetPostById_Failed, GetPostById_Success, LoadPOSTs, LoadPOSTsFail, LoadPOSTsSuccess } from './post.actions';
import { selectAllposts } from './post.reducer';

@Injectable({
  providedIn: 'root'
})
export class PostEffectForHome
{

  constructor(private actions$: Actions, private router: Router, private ServerResponse: GetServerErrorResponseService,
    private postService: PostService, private store: Store, private accoutnService: AccountService,

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
  logoutRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Logout),
      exhaustMap(() =>
        this.accoutnService.logout()
          .pipe(
            map((r) =>
            {
              this.router.navigateByUrl("/");
              return LogoutConfirmed();
            }),
            catchError((e) =>
            {
              return of(LogoutCancelled());
            })
          )
      )
    )
  );
}
