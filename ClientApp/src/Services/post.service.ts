import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostsController } from 'src/Helpers/apiconstants';
import { HttpResponsesObject, Post } from 'src/models.model';
import { ApiCallService } from './api-call.service';

@Injectable({
  providedIn: 'root'
})
export class PostService extends ApiCallService<Post>
{

  constructor(private HttpClient: HttpClient)
  {
    super(HttpClient);

  }

  getAllPosts(): Observable<Post[]>
  {
    return this.HttpClient.get<Post[]>(PostsController.GetPosts);
  }
  AddPost(post: Post): Observable<Post>
  {
    return this.HttpClient.post<Post>(PostsController.AddPost, post);
  }
  UpdatePost(post: Post): Observable<HttpResponsesObject>
  {
    return this.HttpClient.put<HttpResponsesObject>(PostsController.UpdatePost, post);
  }
  IsSlugNotUnique(slug: string): Observable<boolean>
  {
    return this.HttpClient.get<boolean>(`${PostsController.IsSlugUnique}/${slug}`);
  }
  DeletePost(id: number): Observable<HttpResponsesObject>
  {
    return this.HttpClient.delete<HttpResponsesObject>(`${PostsController.DeletePost}/${id}`);
  }
  GetPostById(id: number): Observable<Post>
  {
    return this.HttpClient.get<Post>(`${PostsController.GetPostById}/${id}`);
  }
  ChangeStus(post: Post): Observable<HttpResponsesObject>
  {
    return this.HttpClient.put<HttpResponsesObject>(PostsController.ChangStatus, post);
  }
}
