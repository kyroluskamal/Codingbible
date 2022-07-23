import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SitemapController } from 'src/Helpers/apiconstants';

@Injectable({
  providedIn: 'root'
})
export class SitemapService
{

  constructor(private httpClient: HttpClient) { }
  CreateSitemap()
  {
    return this.httpClient.get(SitemapController.CreateSitemap);
  }
}
