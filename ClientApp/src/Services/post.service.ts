import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostsController } from 'src/Helpers/apiconstants';
import { HttpResponsesObject, Post } from 'src/models.model';

@Injectable({
  providedIn: 'root'
})
export class PostService
{

  constructor(private httpClient: HttpClient) { }

  getAllPosts(): Observable<Post[]>
  {
    return this.httpClient.get<Post[]>(PostsController.GetPosts);
  }
  AddPost(post: Post): Observable<Post>
  {
    return this.httpClient.post<Post>(PostsController.AddPost, post);
  }
  UpdatePost(post: Post): Observable<Post>
  {
    return this.httpClient.put<Post>(PostsController.UpdatePost, post);
  }
  IsSlugUnique(slug: string): Observable<boolean>
  {
    return this.httpClient.get<boolean>(`${PostsController.IsSlugUnique}/${slug}`);
  }
  DeletePost(id: number)
  {
    return this.httpClient.delete(`${PostsController.DeletePost}/${id}`);
  }
  GetPostById(id: number): Observable<Post>
  {
    return this.httpClient.get<Post>(`${PostsController.GetPostById}/${id}`);
  }
  ChangeStus(post: Post)
  {
    return this.httpClient.put<HttpResponsesObject>(PostsController.ChangStatus, post);
  }
}
