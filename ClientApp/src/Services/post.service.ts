import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostsController } from 'src/Helpers/apiconstants';
import { Post } from 'src/models.model';

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
    console.log("from Service");

    return this.httpClient.post<Post>(PostsController.AddPost, post);
  }
  IsSlugUnique(slug: string): Observable<boolean>
  {
    return this.httpClient.get<boolean>(`${PostsController.IsSlugUnique}/${slug}`);
  }
}
