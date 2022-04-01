import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NotificationsService } from 'src/CommonServices/notifications.service';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { CbTableDataSource, ColDefs } from 'src/Interfaces/interfaces';
import { Post } from 'src/models.model';
import { LoadPOSTs, RemovePOST, UpdatePOST } from 'src/State/PostState/post.actions';
import { selectAllposts } from 'src/State/PostState/post.reducer';

@Component({
  selector: 'app-posts-dashboard',
  templateUrl: './posts-dashboard.component.html',
  styleUrls: ['./posts-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostsDashboardComponent implements OnInit
{
  colDefs: ColDefs[] = [
    { field: "id", display: "#" },
    { field: "title", display: "Title", },
    { field: "author.firstname", display: "Author" },
    { field: "dateCreated", display: "Created", pipe: "date" },
    { field: "status", display: "Status", pipe: "postStatus" },
    { field: "commentStatus", display: "Comment Status", pipe: "Boolean" },
    { field: "commentCount", icon: '<i class="bi bi-chat-left-fill"></i>' },
  ];
  resetSelectedRow: boolean = false;
  dataSource: CbTableDataSource<Post> = new CbTableDataSource<Post>();
  posts$ = this.store.select(selectAllposts);
  constructor(private store: Store, private router: Router, private NotificationService: NotificationsService)
  {
  }

  ngOnInit(): void
  {
    this.store.dispatch(LoadPOSTs());

    this.posts$.subscribe(posts =>
    {
      this.dataSource.data = posts;
    });
  }

  AddNewPost(event: Boolean)
  {
    if (event)
    {
      this.router.navigate(['', DashboardRoutes.Home, DashboardRoutes.Posts.Home, DashboardRoutes.Posts.AddPost]);
    }
  }
  EditPost(event: Post)
  {
    this.router.navigateByUrl(`/${DashboardRoutes.Home}/${DashboardRoutes.Posts.Home}/${DashboardRoutes.Posts.EditPost}?id=${event.id}`);
  }
  DeletePost(event: Post)
  {
    this.NotificationService.Confirm_Swal().then(result =>
    {
      if (result.value)
      {
        this.store.dispatch(RemovePOST({ id: event.id, url: "" }));
        this.resetSelectedRow = true;
      }
    });
  }

}
