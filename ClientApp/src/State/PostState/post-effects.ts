import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { DialogHandlerService } from 'src/CommonServices/dialog-handler.service';
import { ServerResponseHandelerService } from 'src/CommonServices/server-response-handeler.service';
import { PostService } from 'src/Services/post.service';
import { AddPOST, AddPOST_Failed, AddPOST_Success, dummyAction, LoadPOSTs, LoadPOSTsSuccess } from './post.actions';
import { selectAllposts } from './post.reducer';

@Injectable({
  providedIn: 'root'
})
export class PostEffects
{

  constructor(private actions$: Actions, private ServerResponse: ServerResponseHandelerService,
    public dialogHandler: DialogHandlerService, private postService: PostService, private store: Store,
    private router: Router,) { }

  AddPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddPOST),
      switchMap((action) =>
        this.postService.AddPost(action).pipe(
          map((r) => AddPOST_Success(r)),
          catchError((e) => of(AddPOST_Failed({ error: e, validationErrors: this.ServerResponse.GetServerSideValidationErrors(e) })))
        )
      )
    )
  );
  GetPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadPOSTs),
      withLatestFrom(this.store.select(selectAllposts)),
      switchMap(([action, posts]) =>
      {
        console.log(posts);
        if (posts.length == 0)
          return this.postService.getAllPosts().pipe(
            map((r) => LoadPOSTsSuccess({ payload: r })),
            catchError((e) => of(AddPOST_Failed({ error: e, validationErrors: this.ServerResponse.GetServerSideValidationErrors(e) })))
          );
        return of(dummyAction());
      }
      )
    )
  );
}
