import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../../core/model/User";
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserServicesService {
  constructor(private http: HttpClient) { }

  getPublicContent(): Observable<any> {
    return this.http.get('http://localhost:8099/api/all', { responseType: 'text' });
  }

  getAllUser(key : String): Observable<any> {
    return this.http.post('http://localhost:4000/api/user/searchUser', { "key": key });
  }

  getUserBoard(): Observable<any> {
    return this.http.get('http://localhost:8099/api/user', { responseType: 'text' });
  }



  getAdminBoard(): Observable<any> {
    return this.http.get('http://localhost:8099/api/admin', { responseType: 'text' });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get('http://localhost:8099/api/user/me', httpOptions);
  }
}
