import {Component} from '@angular/core';
import { FormControl,FormGroup,Validators,FormBuilder } from '@angular/forms';
import {AuthorizationManager} from "./service/authorizationmanager";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'jom';

  constructor(private authService: AuthorizationManager) {
    this.authService.initializeButtonState();
    this.authService.initializeMenuState();
    this.authService.getAuth(this.authService.getUsername())
  }
}
