import { Component, HostListener, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule} from 'primeng/table';
import { StudentSerService } from '../service/student-ser.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, FormsModule, DropdownModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  // encapsulation:ViewEncapsulation.ShadowDom
  
})

export class DashboardComponent  implements OnInit, OnDestroy{

  students: any[] = [];
  filteredStudents: any[] = [];  // Filtered data
  selectedGender: string = '';   // Selected gender
  selectedQualification: string | null = null;
  rowPerPage = 10;  
  totalRecords: number = 0;
  currentPage: number = 0;
  loading: boolean = false;

  genderOptions = [
    // { label:'all', value:''},
    { label:'Male', value:'Male'},
    {label:'Female', value:'Female'},
   ];
  
  qualificationOptions = [
    { label: '10th', value: '10th' },
    { label: '12th', value: '12th' },
    { label: 'UG', value: 'UG' },
    { label: 'PG', value: 'PG' },
    { label: 'PhD', value: 'PhD' }
  ];

  constructor(
    private studentService: StudentSerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
    )   { }

  ngOnInit(): void 
  {
    this.loadStudents(this.currentPage);
  }

  ngOnDestroy() {}
/*last-------------
  loadStudents(page: number) {
    if (this.loading) return;
    this.loading = true;

    console.log("Loading students for page:", page);
    
    this.studentService.getAllStudents(page, this.rowPerPage, this.selectedGender).subscribe({
      next: (response: any) => {
        console.log("API Response:", response);
        this.students = [...this.students, ...response.content]; 
        this.filteredStudents = [...this.students]; // Default to all students
        this.totalRecords = response.page?.totalElements || 0; 
        this.loading = false; 
        // this.generateEducationOptions();
        // this.applyFilters(); 
      },
      error: (error) => {
        console.error("Error fetching students:", error);
        this.loading = false; 
      }
    });
  }

last----------*/

loadStudents(page: number) {
  if (this.loading) return;
  this.loading = true;

  console.log("Loading students for page:", page);
  
  this.studentService.getAllStudents(page, this.rowPerPage, this.selectedGender).subscribe({
    next: (response: any) => {
      console.log("API Response:", response);
      this.students = [...this.students, ...response.content]; 
      
      // Ensure filter is reapplied after loading more data
      this.filterByQualification();
      
      this.totalRecords = response.page?.totalElements || 0; 
      this.loading = false; 
    },
    error: (error) => {
      console.error("Error fetching students:", error);
      this.loading = false; 
    }
  });
}


  // loadStudents(page: number) {
  //   // debugger
  //     if(this.loading) return;
  //     this.loading = true;

  //     console.log("Loading students for page:", page);
 
  //     this.studentService.getAllStudents(page, this.rowPerPage).subscribe({
  //       next: (response: any) => {
  //         console.log("API Response:", response);
  //         this.students = [...this.students, ...response.content]; 
  //         this.totalRecords = response.page?.totalElements || 0; 
  //         this.loading = false; 
  //       },
  //       error: (error) => {
  //         console.error("Error fetching students:", error);
  //         this.loading = false; 
  //       }
  //     });
  //   }
  


  
  // Gender Filter Function
  // filterByGender() {
  //   if (this.selectedGender) {
  //     this.filteredStudents = this.students.filter(s => s.gender === this.selectedGender);
  //   } else {
  //     this.filteredStudents = [...this.students]; // Reset to all
  //   }
  // }
  filterByGender() {
    this.students = []; // Reset the data
    this.currentPage = 0; // Reset pagination
    this.loadStudents(this.currentPage);
  }

  // filterByQualification() {
  //   if (this.selectedQualification) {
  //     this.filteredStudents = this.students.filter(student =>
  //       student.qualifications.some((q: { qualificationLevel: string }) => 
  //         q.qualificationLevel === this.selectedQualification
  //       )
  //     );
  //   } else {
  //     this.filteredStudents = [...this.students]; // Reset list
  //   }
  // }
  /*filterByQualification() {
    if (this.selectedQualification) {
      this.filteredStudents = this.students.filter(student =>
        student.qualifications && student.qualifications.some((q: { qualificationLevel: string }) => 
          q.qualificationLevel === this.selectedQualification
        )
      );
    } else {
      this.filteredStudents = [...this.students]; // Reset list when no qualification is selected
    }
  }*/
 /*last----------------------
    filterByQualification() {
      console.log("Selected Qualification:", this.selectedQualification);
      console.log("Students Data Before Filter:", this.students);
    
      if (this.selectedQualification) {
        this.filteredStudents = this.students.filter(student => {
          console.log("Checking Student:", student);
          console.log("Student Qualifications:", student.qualifications);
    
          return student.qualifications && Array.isArray(student.qualifications) &&
            student.qualifications.some((q: { qualificationLevel: string }) => {
              console.log("Checking Qualification:", q.qualificationLevel);
              return q.qualificationLevel === this.selectedQualification;
            });
        });
      } else {
        this.filteredStudents = [...this.students]; // Reset filter if no qualification selected
      }
    
      console.log("Filtered Students:", this.filteredStudents);
    }
    last------------*/

    filterByQualification() {
      if (!this.students || this.students.length === 0) return;
    
      // Ensure filtering is applied on ALL loaded students
      const allStudents = [...this.students]; // Clone full dataset before filtering
    
      if (this.selectedQualification) {
        this.filteredStudents = allStudents.filter(student =>
          student.qualifications?.some((q: { qualificationLevel: string }) =>
            q.qualificationLevel.toLowerCase().includes(this.selectedQualification!.toLowerCase()) 
          )
        ) || [];
      } else {
        this.filteredStudents = [...allStudents]; // Reset filter if nothing is selected
      }
    
      // Update pagination info
      this.totalRecords = this.filteredStudents.length;
    }
    
    
  

  // generateEducationOptions() {
  //   let uniqueEducation = new Set<string>();
   
  //   this.students.forEach(student => {
  //     if (student.qualification) {
  //       student.qualification.forEach((edu: any) => {
  //         if (edu.qualificationLevel) {
  //           uniqueEducation.add(edu.qualificationLevel);
  //         }
  //       });
  //     }
  //   });
 
  //   // Convert Set to Array and sort
  //   // this.qualificationOptions = [{ label: 'All', value: '' },
  //   //   ...Array.from(uniqueEducation).map(level => ({ label: level, value: level }))
  //   // ];
  //   this.qualificationOptions = [{ label: 'All', value: '' }, 
  //     ...Array.from(uniqueEducation).map(level => ({ label: level, value: level }))
  //   ];
  // }
 
  // applyFilters() {
  //   this.filteredStudents = this.students.filter(student => {
  //     let educationMatch = this.selectedQualification
  //       ? student.qualification.some((edu: any) => edu.qualificationLevel === this.selectedQualification)
  //       : true;     
  //     return  educationMatch;
  //   });
  // }

  downloadExcel() {
   
    const exportData = this.filteredStudents.map(student => {
      const educationInfo = student.qualifications.map((edu: any) => {
        return {
          qualificationLevel: edu.qualificationLevel || '',
          institution: edu.instituteName || '',
          percentage: edu.percentage || '',
          passingYear: edu.passingYear || '',
        };
      });
 
      return {
        firstName: student.firstname || '',
        lastName: student.lastname || '',
        gender: student.gender || '',
        address: student.permanentAddress || '',
        qualification: educationInfo.map((info: { qualificationLevel: string, institution: string, percentage: string, passingYear: string }) =>
          `Level: ${info.qualificationLevel}, Institute: ${info.institution}, Percentage: ${info.percentage}, Passing Year: ${info.passingYear}`).join('; '),
      };
    });
 
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
 
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
 
    XLSX.writeFile(wb, 'filtered_students.xlsx');
  }



    @HostListener('window:scroll', [])
    onScroll() {
      // debugger
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.loadMoreData();
    }
  }

  loadMoreData() {
    // debugger
    if (this.students.length < this.totalRecords && !this.loading) {
      this.currentPage++; 
      this.loadStudents(this.currentPage); 
    }
  }

  // loadMoreData(event: any) {
  //   if (this.loading) return; // Agar loading ho rahi hai toh dobara request mat bhejo
  
  //   const nextPage = event.first / event.rows; // Next page calculate karo
  //   if (nextPage > this.currentPage) { // Sirf tab load karo jab naya page chahiye
  //     this.currentPage = nextPage;
  //     this.loadStudents(this.currentPage);
  //   }
  // }
  

  editStudent(student: any) {
    this.router.navigate(['/edit-student', student.id]); 
  }
  
  deleteStudent(studentId: number) {
    console.log("Deleting student with ID:", studentId);  

    if (confirm('Are you sure you want to delete this student?')) {
        if (!studentId) {
            console.error("Error: Student ID is undefined!");
            return;
        }

        this.studentService.deleteStudent(studentId).subscribe(
            () => {
                console.log("Student deleted successfully:", studentId); 
                this.filteredStudents = this.filteredStudents.filter(s => s.id !== studentId);
                this.totalRecords -= 1;
            },
            (error) => {
                console.error('Error deleting student:', error);
            }
        );
    }
  }
} 

 



  // loadStudents(page: number) {
  //   this.studentService.getAllStudents().subscribe({
  //     next: (data) => {
  //       this.students = data;  
  //     },
  //     error: (err) => {
  //       console.error('Error fetching students:', err);
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load students' });
  //     }
  //   });
  // }






//------------------------html, ts---------------------------


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




//                 <!-- <button pButton type="button" label="Delete" icon="pi pi-trash" class="p-button-danger" (click)="deleteStudent(student.id)"></button> -->



// <!-- [lazy]="true" -->
//   <!-- [virtualScroll]="true"     -->
//   <!-- (onLazyLoad)="loadMoreData($event)"> -->












//   import { Component, HostListener, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
// import { Router } from '@angular/router';
// import { ConfirmationService, MessageService } from 'primeng/api';
// import { TableModule} from 'primeng/table';
// import { StudentSerService } from '../service/student-ser.service';
// import { CommonModule } from '@angular/common';
// import { ButtonModule } from 'primeng/button';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [TableModule, CommonModule, ButtonModule],
//   providers: [ConfirmationService, MessageService],
//   templateUrl: './dashboard.component.html',
//   styleUrl: './dashboard.component.css',
//   // encapsulation:ViewEncapsulation.ShadowDom
  
  
// })

// export class DashboardComponent  implements OnInit, OnDestroy{

//   students: any[] = [];
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





