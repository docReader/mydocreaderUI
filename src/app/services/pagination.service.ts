import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  private url = '';

  constructor(private httpClient: HttpClient) { }

  getData(page: number){
    return this.httpClient.get(this.url + '?page=' + page);
    console.log(page);
  }
}