import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../user.model';

/** JSONPlaceholder returns numeric `id`; we normalize to `User.id: string`. */
type UserFromApi = Omit<User, 'id'> & { id: number };

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/users';

  getUsers(): Observable<User[]> {
    return this.http.get<UserFromApi[]>(this.apiUrl).pipe(
      map((users) => users.map((u) => ({ ...u, id: String(u.id) })))
    );
  }
}
