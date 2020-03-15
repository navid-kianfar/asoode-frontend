import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsersRepositoryService {
  users: any = {};

  constructor() {}
}
