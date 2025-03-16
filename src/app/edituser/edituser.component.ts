import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentSerService } from '../service/student-ser.service';

@Component({
  selector: 'app-edituser',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './edituser.component.html',
  styleUrl: './edituser.component.css'
})
export class EdituserComponent implements OnInit {
  qualificationsForm!: FormGroup;
  qualificationLabels: string[] = ['10th details', '12th details', 'UG details', 'PG details', 'PhD details']; 
  userId!: number;

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private studentService: StudentSerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    // Form initialization
    this.qualificationsForm = this.fb.group({
      firstname: [null, [Validators.required, Validators.minLength(3)]],
      lastname: [null, [Validators.required, Validators.minLength(3)]],
      gender: [null, Validators.required],
      permanentAddress: [null, Validators.required],
      qualifications: this.fb.array([]),
      documents: this.fb.array([])
    });

    // Fetch user data by ID
    this.studentService.getStudentById(this.userId).subscribe(user => {
      this.prefillForm(user);
    });
  }

  get qualifications(): FormArray {
    return this.qualificationsForm.get('qualifications') as FormArray;
  }

  get documentsArray(): FormArray {
    return this.qualificationsForm.get('documents') as FormArray;
  }

  // prefillForm(user: any): void {
  //   this.qualificationsForm.patchValue({
  //     firstname: user.firstname,
  //     lastname: user.lastname,
  //     gender: user.gender,
  //     permanentAddress: user.permanentAddress
  //   });

  //   user.qualifications.forEach((q: any) => {
  //     this.qualifications.push(
  //       this.fb.group({
  //         instituteName: [q.instituteName, Validators.required],
  //         percentage: [q.percentage, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
  //         passingYear: [q.passingYear, [Validators.required, Validators.pattern(/^\d{4}$/)]]
  //       })
  //     );
  //   });

  //   user.documents.forEach((d: any) => {
  //     this.documentsArray.push(
  //       this.fb.group({
  //         documentLabel: [d.documentLabel],
  //         previewUrl: [d.previewUrl]
  //       })
  //     );
  //   });
  // }

  newDocumentUpload(label: string): FormGroup { 
    return this.fb.group({ 
      documentLabel: [label],  
      file: [null, Validators.required], 
      previewUrl: ['']  // Store image preview 
    }); 
  }  

  createDocumentField(label: string): FormGroup { 
    return this.fb.group({ 
      documentLabel: [label], 
      file: [null, Validators.required], 
      fileName: [''], 
      previewUrl: [''] 
    }); 
  } 

  addDocument(): void {
    const docIndex = this.documentsArray.length; // Get current document index 
    if (docIndex < this.qualificationLabels.length) { 
      this.documentsArray.push(this.createDocumentField(this.qualificationLabels[docIndex] + ' Marksheet')); 
    } 

  } 
 

  removeDocument(index: number): void { 
    if (this.documentsArray.length > 0) { 
      this.documentsArray.removeAt(index);
    } 
  } 

  onFileSelected(event: any, index: number): void {  
    const file = event.target.files[0];  
    if (file) {  
      const reader = new FileReader();  
      reader.onload = (e : any) => {  
        this.documentsArray.at(index).patchValue({   
          file: file,   
          previewUrl:  e.target.result    
        });  
      };     
      reader.readAsDataURL(file);  
    }  
  }  

  prefillForm(user: any): void {
    this.qualificationsForm.patchValue({
      firstname: user.firstname,
      lastname: user.lastname,
      gender: user.gender,
      permanentAddress: user.permanentAddress
    });
  
    // Ensure qualifications exist before looping
    if (user.qualifications && Array.isArray(user.qualifications)) {
      user.qualifications.forEach((q: any) => {
        this.qualifications.push(
          this.fb.group({
            instituteName: [q.instituteName, Validators.required],
            percentage: [q.percentage, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
            passingYear: [q.passingYear, [Validators.required, Validators.pattern(/^\d{4}$/)]]
          })
        );
      });
    }
  
    // Ensure documents exist before looping
    if (user.documents && Array.isArray(user.documents)) {
      user.documents.forEach((d: any) => {
        this.documentsArray.push(
          this.fb.group({
            documentLabel: [d.documentLabel],
            previewUrl: [d.previewUrl]
          })
        );
      });
    }
  }
  

  onSubmit(): void {
    if (this.qualificationsForm.valid) {
      this.studentService.updateStudent(this.userId, this.qualificationsForm.value).subscribe(() => {
        alert('User updated successfully!');
        this.router.navigate(['/dashboard']);
      });
    }
  }
}







