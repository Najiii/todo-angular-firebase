import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { User } from '../app/Model/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  txtSignUpUser: String = null;
  txtTodo: String;

  currentUser: User;

  userList: Array<User> = [];

  message: String;

  constructor(private db: AngularFireDatabase) {
    this.db.list('tasks').valueChanges().subscribe((res) => res.map((el, i) => {
      this.userList.push(res[i.toString()])
    }))
  }

  public addUser() {
    if(this.txtSignUpUser !== null) {
      if(this.txtSignUpUser.match(/\S+@\S+\.\S+/)) {
        if(!this.doesThisUserExists(this.txtSignUpUser)) {
          let user = new User(this.txtSignUpUser.toString(), []);

          this.db.database.ref('tasks').child(this.txtSignUpUser.toString().replace(".", "-")).set(user).then(() => {
            this.currentUser = user;
          })
  
          this.message = "Thank you for signing up, you can add Todos now."

        } else {
          this.message = "This Email already exists in database. We will load your todos."
          
          this.setCurrentUser();
        }
        
      } else {
        this.message = "Please enter a valid Email.";
      }
    }
  }

  public addTodoForUser() {
    if(this.currentUser !== null) {
      if(this.doesThisUserExists(this.currentUser.email)) {

        this.currentUser.todo.push(this.txtTodo);
  
        this.updateCurrentUser();
      }
    }
  }

  public logoutUser() {
    this.currentUser = null;
  }

  public updateCurrentUser() {
    this.db.database.ref('tasks').child(this.currentUser.email.replace('.', '-')).remove();
    this.db.database.ref('tasks').child(this.currentUser.email.replace('.', '-')).update(this.currentUser);
  }

  public setCurrentUser() {
    for(let i = 0; i < this.userList.length; i++) {
      if(this.userList[i].email === this.txtSignUpUser) {
        this.currentUser = this.userList[i];

        if(Object.values(this.currentUser).length == 1) {
          this.currentUser.todo = [];
        }
      }
    }
  }

  public removeTodo(index) {
    if(this.currentUser !== null) {
      if(this.doesThisUserExists(this.currentUser.email)) {
        this.currentUser.todo = this.currentUser.todo.filter((item) => item !== this.currentUser.todo[index])
        
        this.updateCurrentUser();
      }
    }
  }

  public updateTodo(todo, i) {
    this.currentUser.todo[i] = todo;

    this.updateCurrentUser();
  }

  // Validation functions.
  public doesThisUserExists(username) {
    return this.userList.some((el) => el["email"] === username);
  }
}
