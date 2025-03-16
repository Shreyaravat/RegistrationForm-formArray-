import { RouterModule, Routes } from '@angular/router';
import { StudentformComponent } from './studentform/studentform.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { EdituserComponent } from './edituser/edituser.component';

export const routes: Routes = [
{ path: '', redirectTo: 'student', pathMatch: 'full' },  //  Default route set
  { path: 'student', component: StudentformComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'edit-student/:id', component: EdituserComponent },
];
 
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }


