import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; 

bootstrapApplication(AppComponent, appConfig)
  
.catch((err) => console.error(err));









// import { Component, HostListener, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
// import { Router } from '@angular/router';
// import { ConfirmationService, MessageService } from 'primeng/api';
// import { TableModule} from 'primeng/table';
// import { StudentSerService } from '../service/student-ser.service';
// import { CommonModule } from '@angular/common';
// import { ButtonModule } from 'primeng/button';
// import * as XLSX from 'xlsx';
// import { FormsModule } from '@angular/forms';


// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [TableModule, CommonModule, ButtonModule, FormsModule],
//   providers: [ConfirmationService, MessageService],
//   templateUrl: './dashboard.component.html',
//   styleUrl: './dashboard.component.css',
//   // encapsulation:ViewEncapsulation.ShadowDom
  
  
// })

// export class DashboardComponent  implements OnInit, OnDestroy{

//   students: any[] = [];
//   filteredStudents: any[] = [];  // Filtered data
//   selectedGender: string = '';   // Selected gender
//   rowPerPage = 10;  
//   totalRecords: number = 0;
//   currentPage: number = 0;
//   loading: boolean = false;

//   constructor(
//     private studentService: StudentSerService,
//     private confirmationService: ConfirmationService,
//     private messageService: MessageService,
//     private router: Router
//     )   {}

//   ngOnInit(): void {
//     // debugger
//     this.loadStudents(this.currentPage);
//   }

//   ngOnDestroy() {}

//   loadStudents(page: number) {
//     // debugger
//       if(this.loading) return;
//       this.loading = true;

//       console.log("Loading students for page:", page);
 
//       this.studentService.getAllStudents(page, this.rowPerPage).subscribe({
//         next: (response: any) => {
//           console.log("API Response:", response);
//           this.students = [...this.students, ...response.content]; 
//           this.totalRecords = response.page?.totalElements || 0; 
//           this.loading = false; 
//         },
//         error: (error) => {
//           console.error("Error fetching students:", error);
//           this.loading = false; 
//         }
//       });
//     }
  


//   // loadStudents(page: number) {
//   //   if (this.loading) return;
//   //   this.loading = true;

//   //   this.studentService.getAllStudents(page, this.rowPerPage).subscribe({
//   //     next: (response: any) => {
//   //       this.students = [...this.students, ...response.content];
//   //       this.filteredStudents = this.students;  // Set filtered data initially
//   //       this.totalRecords = response.page?.totalElements || 0;
//   //       this.loading = false;
//   //     },
//   //     error: (error) => {
//   //       console.error("Error fetching students:", error);
//   //       this.loading = false;
//   //     }
//   //   });
//   // }

//   // Gender Filter Function
//   filterByGender() {
//     if (this.selectedGender) {
//       this.filteredStudents = this.students.filter(s => s.gender === this.selectedGender);
//     } else {
//       this.filteredStudents = [...this.students]; // Reset to all
//     }
//   }

//   // Download Excel Function
//   // downloadExcel() {
//   //   if (!this.selectedGender) {
//   //     alert("Please select a gender filter before downloading!");
//   //     return;
//   //   }

//   //   const data = this.filteredStudents.map(student => ({
//   //     'First Name': student.firstname,
//   //     'Last Name': student.lastname,
//   //     'Gender': student.gender,
//   //     'Address': student.permanentAddress,
//   //     'Qualifications': student.qualifications
//   //   }));

//   //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
//   //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
//   //   XLSX.utils.book_append_sheet(wb, ws, 'Filetered Students');

//   //   XLSX.writeFile(wb,  `filtered_students_${this.selectedGender}.xlsx`);
//   // }


//     @HostListener('window:scroll', [])
//     onScroll() {
//       // debugger
//     if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
//       this.loadMoreData();
//     }
//   }

//   loadMoreData() {
//     // debugger
//     if (this.students.length < this.totalRecords && !this.loading) {
//       this.currentPage++; 
//       this.loadStudents(this.currentPage); 
//     }
//   }

//   // loadMoreData(event: any) {
//   //   if (this.loading) return; // Agar loading ho rahi hai toh dobara request mat bhejo
  
//   //   const nextPage = event.first / event.rows; // Next page calculate karo
//   //   if (nextPage > this.currentPage) { // Sirf tab load karo jab naya page chahiye
//   //     this.currentPage = nextPage;
//   //     this.loadStudents(this.currentPage);
//   //   }
//   // }
  

//   editStudent(student: any) {
//     this.router.navigate(['/edit-student', student.id]); 
//   }
  
//   deleteStudent(studentId: number) {
//     console.log("Deleting student with ID:", studentId);  

//     if (confirm('Are you sure you want to delete this student?')) {
//         if (!studentId) {
//             console.error("Error: Student ID is undefined!");
//             return;
//         }

//         this.studentService.deleteStudent(studentId).subscribe(
//             () => {
//                 console.log("Student deleted successfully:", studentId); 
//                 this.students = this.students.filter(s => s.id !== studentId);
//                 this.totalRecords -= 1;
//             },
//             (error) => {
//                 console.error('Error deleting student:', error);
//             }
//         );
//     }
//   }
// } 



// HTML



// <p-table  
//   [value]="students" 
//   [rows]="rowPerPage" 
//   [totalRecords]="totalRecords"
//   [scrollable]="true">
//    <!-- scrollHeight="600px"> -->
  

//     <ng-template pTemplate="header">
//         <tr>
//             <th pSortableColumn="firstname">First Name <p-sortIcon field="firstname"></p-sortIcon></th>
//             <th pSortableColumn="lastname">Last Name <p-sortIcon field="lastname"></p-sortIcon></th>
//             <th pSortableColumn="gender">Gender <p-sortIcon field="gender"></p-sortIcon></th>
//             <th pSortableColumn="permanentAddress">Permanent Address <p-sortIcon field="permanentAddress"></p-sortIcon></th>
//             <th>Qualifications</th>
//             <th>Actions</th>
//         </tr>
//     </ng-template>
//     <ng-template pTemplate="body" let-student>
//         <tr>
//             <td>{{ student.firstname }}</td>
//             <td>{{ student.lastname }}</td>
//             <td>{{ student.gender }}</td>
//             <td>{{ student.permanentAddress }}</td>

//             <td>
//                 <table style="width: 100%; border-collapse: collapse;">
//                     <!-- Header Row -->
//                     <tr style="font-weight: bold; background-color: #f2f2f2;">
//                         <td style="padding: 5px;">Qualification</td>
//                         <td style="padding: 5px;">School/Institute Name</td>
//                         <td style="padding: 5px;">Percentage</td>
//                         <td style="padding: 5px;">Passing Year</td>
//                     </tr>
//                     <!-- Data Rows -->
//                     <tr *ngFor="let qual of student.qualifications">
//                         <td style="font-weight: bold; padding-right: 10px;">{{ qual.qualificationLevel }}</td>
//                         <td>{{ qual.instituteName }}</td>
//                         <td>{{ qual.percentage }}%</td>
//                         <td>({{ qual.passingYear }})</td>
//                     </tr>
//                 </table>
//             </td>     

//             <td>
//                 <button pButton type="button" label="Edit" icon="pi pi-pencil" (click)="editStudent(student)"></button> &nbsp;
//                 <button pButton type="button" label="Delete" icon="pi pi-trash" 
//                 class="p-button-danger" (click)="deleteStudent(student.id)">
//             </button>
            
//             </td>
//         </tr>
//     </ng-template>
// </p-table>
