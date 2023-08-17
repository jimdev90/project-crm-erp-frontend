import {Component, OnInit} from '@angular/core';
import {ColaboradorService} from "../../services/colaborador.service";
import {Router} from "@angular/router";
declare const $: any;

interface UserLogin {
  email: string;
  password: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit{
  public user: UserLogin = {
    email: '',
    password: ''
  };

  public token:string | null = localStorage.getItem('token');

  constructor(private _colaboradorService: ColaboradorService, private _router: Router) {
  }
  ngOnInit(): void {
    if (this.token){
      this._router.navigate(['/dashboard'])
    }
  }

  login(){

    if (!this.user.email){
      this.mostrarNotificacion('El email es requerido')
    }
    else if (!this.user.password){
      this.mostrarNotificacion('El password es requerido')
    }else {
      console.log(this.user)
      this._colaboradorService.login_admin(this.user).subscribe(
        response =>{
          console.log(response)
          if (response.data === undefined){
            this.mostrarNotificacion(`${response.message}`)
          }else{
            const {data, token} = response;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('_id', data._id);
            this._router.navigate(['/dashboard'])
          }
        }
      )
    }
  }

  mostrarNotificacion(mensaje:string){
    $.notify(`${mensaje}`,{
      type: 'danger',
      spacing: 10,
      timer: 2000,
      placement: {
        from: 'top',
        align: 'right'
      },
      delay: 1000,
      animate: {
        enter: `animated bounce`,
        exit: `animated bounce`
      }
    });
  }
}
