import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Section } from 'src/models.model';
import { ApiCallService } from './api-call.service';

@Injectable({
  providedIn: 'root'
})
export class SectionsService extends ApiCallService<Section>
{

  constructor(private HttpClient: HttpClient)
  {
    super(HttpClient);
  }
}
