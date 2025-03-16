
import { Component } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { FormGroup,FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms' 
import { HttpClient } from '@angular/common/http'; 
import { Router } from '@angular/router';


// export function noWhitespaceValidator(): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {
//     if (control.value && control.value.trim().length === 0) {
//       return { whitespace: true }; // Return an error object
//     }
//     return null; // No error
//   };
// }

@Component({ 
  selector: 'app-studentform', 
  imports: [CommonModule, ReactiveFormsModule, FormsModule], 
  templateUrl: './studentform.component.html', 
  styleUrls: ['./studentform.component.css'] 
}) 

export class StudentformComponent { 
  qualificationsForm: FormGroup; 
  qualificationLabels: string[] = ['10th details', '12th details', 'UG details', 'PG details', 'PhD details']; 
  submittedData: any | null = null; 
  imageUrl: string = ''; 
  showModal: boolean = false;
  zoomLevel: number = 1;
  rotationAngle: number = 0; 


  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { 
    this.qualificationsForm = this.fb.group({ 
      firstname: [null,  [Validators.required, Validators.minLength(3)]],  
      lastname: [null, [Validators.required, Validators.minLength(3)]],  
      gender: [null, Validators.required],  
      permanentAddress: [null, Validators.required],  
      // optionalAddress: '', 
      qualifications: this.fb.array([this.newQualification()]), 
      documentsArray: this.fb.array([]) ,

      // documents: this.fb.array([])  
      documents: this.fb.array([ 
        this.createDocumentField('10th Marksheet') // Default document field
      
      ]) 
    }); 
  }  

 

  // noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  //   if (control.value && control.value.trim().length === 0) {
  //     return { whitespace: true }; // Custom error key
  //   }
  //   return null;
  // }

  get qualifications(): FormArray { 
    return this.qualificationsForm.get('qualifications') as FormArray; 
  } 

  get firstname() { 
    return this.qualificationsForm.get('firstname'); 
  }  

  get lastname() { 
    return this.qualificationsForm.get('lastname'); 
  } 

  get gender() {
    return this.qualificationsForm.get('gender'); 
  } 

  get permanentAddress() { 
    return this.qualificationsForm.get('permanentAddress'); 
  } 
   
  get documentsArray(): FormArray { 
    return this.qualificationsForm.get('documents') as FormArray;
  } 

  newQualification(): FormGroup {
    return this.fb.group({ 
      instituteName: ['', Validators.required], 
      percentage: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      passingYear: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]], 
    }); 
  } 

  addQualification(): void { 
    if (this.qualifications.length < 5) { 
      this.qualifications.push(this.newQualification()); 
    } 
  } 

  removeQualification(index: number): void 
  { 
    if (this.qualifications.length > 1)  
    {  
      this.qualifications.removeAt(index); 
    } 
  } 

  getQualificationLabel(index: number): string { 
    return this.qualificationLabels[index] || 'Other';
  } 

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

  // addDocument(): void {
  //   const docIndex = this.documentsArray.length; // Get current document index 
  //   if (docIndex < this.qualificationLabels.length) { 
  //     this.documentsArray.push(this.createDocumentField(this.qualificationLabels[docIndex] + ' Marksheet')); 
  //   } 

  // } 
  addDocument() {
    const documentForm = this.fb.group({
        documentLabel: [''],
        file: [null],
        fileName: [''],
        previewUrl: ['']
    });

    (this.qualificationsForm.get('documentsArray') as FormArray).push(documentForm);
}


  removeDocument(index: number): void { 
    if (this.documentsArray.length > 0) { 
      this.documentsArray.removeAt(index);
    } 
  } 

  openFullScreen(url: string): void {
    this.imageUrl = url;
    this.showModal = true;
    this.zoomLevel = 1;  // Reset zoom
    this.rotationAngle = 0; // Reset rotation
  }
  
  closeModal(): void {
    this.showModal = false;
  }
  
  zoomIn(): void {
    this.zoomLevel += 0.2; // Increase zoom
  }
  
  zoomOut(): void {
    if (this.zoomLevel > 0.4) { // Prevent excessive shrinking
      this.zoomLevel -= 0.2;
    }
  }
  
  rotateLeft(): void {
    this.rotationAngle -= 90; // Rotate counterclockwise
  }
  
  rotateRight(): void {
    this.rotationAngle += 90; // Rotate clockwise
  }


    // onFileSelected(event: any, index: number): void { 
    //   const file = event.target.files[0];    
    //   if (file) {    
    //     const reader = new FileReader();    
    //     reader.onload = (e : any) => {    
    //       this.documentsArray.at(index).patchValue({     
    //         file: file,     
    //         previewUrl:  e.target.result      
    //       });    
    //     };       
    //     reader.readAsDataURL(file);    
    //   }    
    // } 
//---------last------------
  //   onFileSelected(event: any, index: number): void { 
  //     const file = event.target.files[0];    
  //     if (file) {    
  //         const reader = new FileReader();    
  //         reader.onload = (e: any) => {    
  //             const docArray = this.qualificationsForm.get('qualifications') as FormArray;
  //             const qualification = docArray.at(index) as FormGroup;
  
  //             // File preview logic (Existing)
  //             this.documentsArray.at(index).patchValue({     
  //                 file: file,     
  //                 previewUrl: e.target.result      
  //             });
  
  //             // File name store logic
  //             let docList = qualification.get('documents')?.value || [];
  //             docList.push(file.name);
  //             qualification.patchValue({ documents: docList });
  //         };       
  //         reader.readAsDataURL(file);    
  //     }    
  // }
  //---------last------------
//--------------------fileselcted-----------------------

  onFileSelected(event: any, index: number): void {  
    const file = event.target.files[0];  

    if (file) {  
        console.log(`File selected at index ${index}:`, file.name); // Debugging: File name

        const reader = new FileReader();  
        reader.onload = (e: any) => {  
            console.log(`Updating document at index ${index}, Document Label:`, this.documentsArray.at(index).get('documentLabel')?.value);

            this.documentsArray.at(index).patchValue({   
                file: file,  
                fileName: file.name,  
                previewUrl: e.target.result    
            });  

            console.log(`File uploaded successfully for:`, this.documentsArray.at(index).value);
        };     

        reader.readAsDataURL(file);  
    } else {
        console.log(`No file selected at index ${index}`);
    }
}  

//--------------------fileselcted-----------------------
// onFileSelected(event: any, index: number): void {  
//   const file = event.target.files[0];  

//   if (file) {  
//       console.log(`File selected at index ${index}:`, file.name); // Debugging: File name

//       const reader = new FileReader();  
//       reader.onload = (e: any) => {  
//           console.log(`Updating document at index ${index}, Document Label:`, this.documentsArray.at(index).get('documentLabel')?.value);

//           //  File details update with previewUrl intact
//           this.documentsArray.at(index).patchValue({   
//               file: file,  
//               fileName: file.name,  
//               previewUrl: e.target.result    //  Preview nahi hatega
//           });  

//           console.log(`File uploaded successfully for:`, this.documentsArray.at(index).value);
//       };     

//       reader.readAsDataURL(file);  
//   } else {
//       console.log(`No file selected at index ${index}`);
//   }
// }  



    // onFileSelected(event: any, index: number) {
    //   const file = event.target.files[0];
    //   if (file) {
    //     const docArray = this.qualificationsForm.get('qualifications') as FormArray;
    //     const qualification = docArray.at(index) as FormGroup;
    
    //     let docList = qualification.get('documents')?.value || [];
    //     docList.push(file.name);
    //     qualification.patchValue({ documents: docList });
    
    //     console.log("Updated Documents Array: ", this.qualificationsForm.value.qualifications);
    //   }
    // }
    
    onSubmit(): void {   
      if (this.qualificationsForm.valid) {     
         const formData = this.qualificationsForm.value;  
        console.log("Form data for preview",formData);
        console.log("Final Submitted Form Data: ", this.qualificationsForm.value);
  
        const qualificationLevels = ['10th', '12th', 'UG', 'PG', 'PhD'];    
        formData.qualifications = formData.qualifications.map((qualification: any, index: number) => ({    
          ...qualification,    
          qualificationLevel: qualificationLevels[index] || 'Other'    
        }));  
  
      formData.documents = formData.documents.map((doc: any) => ({    
        documentLabel: doc.documentLabel,    
        previewUrl: doc.previewUrl   
      }));    
        this.submittedData = formData;    
      }    
    }  
    
  isImage(url: string): boolean { 
    return url?.startsWith('data:image'); 
  } 
   
  isPdf(url: string): boolean {
    return url?.endsWith('.pdf'); 
  }  

  // openFullScreen(url: string): void {
  //   this.imageUrl = url;
  //   this.showModal = true;
  // }

  // closeModal(): void {
  //   this.showModal = false;
  // } 

  // finalSubmit(): void {  
  //   const formData = this.qualificationsForm.value;        
  //   // Ensure that formData.documents exists and is properly formatted 
  //   const documentNames = formData.documents 
  //     .filter((doc: any) => doc.file) // Ensure a file exists 
  //     .map((doc: any) => ({ documentLabel: doc.documentLabel, fileName: doc.file.name })); 
  //   // Map documents correctly to the corresponding qualifications 
  //   formData.qualifications = formData.qualifications.map((qualification: any, index: number) => ({ 
  //     ...qualification, 
  //     qualificationLevel: this.qualificationLabels[index] || 'Other', 
  //     documents: documentNames.length > index ? [documentNames[index]] : [] // Ensure a non-empty array 
  //   }));  
  //   // Remove the separate document array from formData before sending to backend 
  //   delete formData.documents;   
  //   this.http.post('http://localhost:8080/api/students', formData) 
  //     .subscribe( 
  //       response => console.log('Submitted successfully', response), 
  //       error => console.error('Submit failed', error) 
  //     ); 
  //     this.router.navigate(['/dashboard']);
  //   }



  finalSubmit(): void {    
    const formData = new FormData();    
    const formValue = this.qualificationsForm.value;     

    // debugger
    // Convert form data to JSON (excluding files)    
    const studentJson = {    
        firstname: formValue.firstname,    
        lastname: formValue.lastname,    
        gender: formValue.gender,    
        permanentAddress: formValue.permanentAddress,    
        qualifications: formValue.qualifications.map((qualification: any, index: number) => ({
          qualificationLevel: this.qualificationLabels[index] || 'Other',
          percentage: qualification.percentage,
          passingYear: qualification.passingYear,
          instituteName: qualification.instituteName,
          documents:formValue?.documents[0]?.previewUrl
          // documents: qualification.documents ? qualification.documents.map((doc: any) => doc.name) : []      // Fix: use doc.name
      }))         
    };     

    console.log(studentJson);  

    // console.log("Final FormData before submission:", formData);     

    this.http.post('http://localhost:8080/api/students/add', studentJson).subscribe((res:any)=>{
      console.log(res);
      // debugger
      
    })        

    this.router.navigate(['/dashboard']);    
  }



// finalSubmit(): void {    
//   const formValue = this.qualificationsForm.value;     

//   const studentJson = {    
//       firstname: formValue.firstname,    
//       lastname: formValue.lastname,    
//       gender: formValue.gender,    
//       permanentAddress: formValue.permanentAddress,    
//       qualifications: formValue.qualifications.map((qualification: any, index: number) => ({
//           qualificationLevel: this.qualificationLabels[index] || 'Other',
//           percentage: qualification.percentage,
//           passingYear: qualification.passingYear,
//           instituteName: qualification.instituteName,
//           // Ensure only filenames are sent
//           documents: qualification.documents ? qualification.documents.map((doc: any) => doc) : []
//       }))         
//   };     

//   console.log("Final JSON Before Sending:", studentJson);

//   this.http.post('http://localhost:8080/api/students/add', studentJson).subscribe((res: any) => {
//       console.log(res);
//   });

//   this.router.navigate(['/dashboard']);    
// }

}































  // finalSubmit() {
  //   if (this.qualificationsForm.valid) {
  //     this.submittedData = this.qualificationsForm.value;
  
  //     const payload = {
  //       ...this.qualificationsForm.value,
  //       qualifications: this.qualificationsForm.value.qualifications.map((qual: any) => ({
  //         qualificationLevel: qual.qualificationLevel,
  //         instituteName: qual.instituteName,
  //         percentage: qual.percentage,
  //         passingYear: qual.passingYear,
  //         documents: qual.documents || [] // Ensure documents are included
  //       }))
  //     };
  
  //     console.log("Final Payload:", JSON.stringify(payload, null, 2)); // Debugging ke liye
  //     this.http.post('http://localhost:8080/api/student', payload).subscribe(response => {
  //       console.log('Response from backend:', response);
  //       alert('Form submitted successfully!');
  //       this.router.navigate(['/dashboard']);
  //     }, error => {
  //       console.error('Error submitting form:', error);
  //     });
  //   } else {
  //     alert("Form is invalid. Please check the fields.");
  //   }
  // }
  
  










  //----------------OLD TS---------------------
   

// import { Component } from '@angular/core'; 
// import { CommonModule } from '@angular/common'; 
// import { FormGroup,FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms' 
// import { HttpClient } from '@angular/common/http'; 
// import { Router } from '@angular/router';

// @Component({ 
//   selector: 'app-studentform', 
//   imports: [CommonModule, ReactiveFormsModule, FormsModule], 
//   templateUrl: './studentform.component.html', 
//   styleUrls: ['./studentform.component.css'] 
// }) 

// export class StudentformComponent { 
//   qualificationsForm: FormGroup; 
//   qualificationLabels: string[] = ['10th details', '12th details', 'UG details', 'PG details', 'PhD details']; 
//   submittedData: any | null = null; 
//   imageUrl: string = ''; 
//   showModal: boolean = false; 

//   constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { 
//     this.qualificationsForm = this.fb.group({ 
//       firstname: ['',  [Validators.required, Validators.minLength(3)]],  
//       lastname: ['', [Validators.required, Validators.minLength(3)]],  
//       gender: ['', Validators.required],  
//       permanentAddress: ['', Validators.required],  
//       // optionalAddress: '', 
//       qualifications: this.fb.array([this.newQualification()]), 
//       // documents: this.fb.array([])  
//       documents: this.fb.array([ 
//         this.createDocumentField('10th Marksheet') // Default document field 
//       ]) 
//     }); 
//   }  

//   get qualifications(): FormArray { 
//     return this.qualificationsForm.get('qualifications') as FormArray; 
//   } 

//   get firstname() { 
//     return this.qualificationsForm.get('firstname'); 
//   }  

//   get lastname() { 
//     return this.qualificationsForm.get('lastname'); 

//   } 

//   get gender() {
//     return this.qualificationsForm.get('gender'); 
//   } 


//   get permanentAddress() { 
//     return this.qualificationsForm.get('permanentAddress'); 

//   } 
   
//   get documentsArray(): FormArray { 
//     return this.qualificationsForm.get('documents') as FormArray; 

//   } 

//   newQualification(): FormGroup {
//     return this.fb.group({ 
//       instituteName: ['', Validators.required], 
//       percentage: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
//       passingYear: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]], 
//     }); 
//   } 

//   addQualification(): void { 
//     if (this.qualifications.length < 5) { 
//       this.qualifications.push(this.newQualification()); 
//     } 
//   } 

//   removeQualification(index: number): void 
//   { 
//     if (this.qualifications.length > 1)  
//     {  
//       this.qualifications.removeAt(index); 
//     } 
//   } 

//   getQualificationLabel(index: number): string { 
//     return this.qualificationLabels[index] || 'Other';
//   } 

//   newDocumentUpload(label: string): FormGroup { 
//     return this.fb.group({ 
//       documentLabel: [label],  
//       file: [null, Validators.required], 
//       previewUrl: ['']  // Store image preview 
//     }); 
//   } 

//   createDocumentField(label: string): FormGroup { 
//     return this.fb.group({ 
//       documentLabel: [label], 
//       file: [null, Validators.required], 
//       fileName: [''], 
//       previewUrl: [''] 
//     }); 
//   } 

//   addDocument(): void {
//     const docIndex = this.documentsArray.length; // Get current document index 
//     if (docIndex < this.qualificationLabels.length) { 
//       this.documentsArray.push(this.createDocumentField(this.qualificationLabels[docIndex] + ' Marksheet')); 
//     } 

//   } 

//   removeDocument(index: number): void { 
//     if (this.documentsArray.length > 0) { 
//       this.documentsArray.removeAt(index);
//     } 
//   } 

//     onFileSelected(event: any, index: number): void {  

//       const file = event.target.files[0];  
  
//       if (file) {  
  
//         const reader = new FileReader();  
  
//         reader.onload = (e : any) => {  
  
//           this.documentsArray.at(index).patchValue({   
  
//             file: file,   
  
//             previewUrl:  e.target.result    
  
//           });  
  
//         };     
  
//         reader.readAsDataURL(file);  
  
//       }  
  
//     } 

//     onSubmit(): void {   

//       if (this.qualificationsForm.valid) {     
  
//         const qualificationLevels = ['10th', '12th', 'UG', 'PG', 'PhD'];  
  
//         const formData = this.qualificationsForm.value;  
  
//         formData.qualifications = formData.qualifications.map((qualification: any, index: number) => ({  
  
//           ...qualification,  
  
//           qualificationLevel: qualificationLevels[index] || 'Other'  
  
//         }));  
//         // Include document previews  
  
//       formData.documents = formData.documents.map((doc: any) => ({  
  
//         documentLabel: doc.documentLabel,  
  
//         previewUrl: doc.previewUrl // This will be shown in the preview  
  
//       }));  
//         console.log(formData);  
  
//         this.submittedData = formData;  
  
//       }  
  
//     }  
    
//   isImage(url: string): boolean { 
//     return url?.startsWith('data:image'); 
//   } 

   
//   isPdf(url: string): boolean {
//     return url?.endsWith('.pdf'); 
//   }  

//   openFullScreen(url: string): void {
//     this.imageUrl = url;
//     this.showModal = true;
//   }

//   closeModal(): void {
//     this.showModal = false;
//   } 

//   finalSubmit(): void {     

//     const formData = this.qualificationsForm.value;        

//     // Ensure that formData.documents exists and is properly formatted 

//     const documentNames = formData.documents 

//       .filter((doc: any) => doc.file) // Ensure a file exists 

//       .map((doc: any) => ({ documentLabel: doc.documentLabel, fileName: doc.file.name })); 

//     // Map documents correctly to the corresponding qualifications 

//     formData.qualifications = formData.qualifications.map((qualification: any, index: number) => ({ 

//       ...qualification, 

//       qualificationLevel: this.qualificationLabels[index] || 'Other', 

//       documents: documentNames.length > index ? [documentNames[index]] : [] // Ensure a non-empty array 

//     }));  

//     // Remove the separate document array from formData before sending to backend 

//     delete formData.documents;   

//     this.http.post('http://localhost:8080/api/students', formData) 

//       .subscribe( 

//         response => console.log('Submitted successfully', response), 

//         error => console.error('Submit failed', error) 

//       ); 
//       this.router.navigate(['/dashboard']);

//     }
//   }  

//-----------------OLD HTML---------------

// <div class="center-container">
//   <div class="form-container">
  
//     <h1 class="form-title">Student Registration</h1>
  
//     <form [formGroup]="qualificationsForm" (ngSubmit)="onSubmit()" class="form-class">
      
//       <div class="name-container">
//         <p>
//           <label for="firstname">First Name : </label>
//           <input type="text" id="firstname" formControlName="firstname">
//           <span *ngIf="firstname?.touched && firstname?.invalid" class="error-message">
//             <span *ngIf="firstname?.errors?.['required']">First Name is required.</span>
//             <span *ngIf="firstname?.errors?.['minlength']">Minimum 3 characters required.</span>
//           </span>
//         </p>
      
//         <p>
//           <label for="lastname">Last Name : </label>
//           <input type="text" id="lastname" formControlName="lastname">
//           <span *ngIf="lastname?.touched && lastname?.invalid" class="error-message">
//             <span *ngIf="lastname?.errors?.['required']">Last Name is required.</span>
//             <span *ngIf="lastname?.errors?.['minlength']">Minimum 3 characters required.</span>
//           </span>
//         </p>
//       </div>

//       <div class="gender-container">
//         <p>
//           <label>Gender:</label>
//           <input type="radio" formControlName="gender" value="Male"> Male
//           <input type="radio" formControlName="gender" value="Female"> Female
//           <span *ngIf="gender?.touched && gender?.invalid" class="error-message">Gender is required.</span>
//         </p>
//       </div>

//       <div class="address-container">
//         <p>
//           <label for="permanentAddress">Permanent Address:</label>
//           <textarea id="permanentAddress" formControlName="permanentAddress"></textarea>
//           <span *ngIf="permanentAddress?.touched && permanentAddress?.invalid" class="error-message">Permanent Address is required.</span>
//         </p>
//       </div>

//       <div class="qualifications-container" formArrayName="qualifications">
//         <div *ngFor="let qualification of qualifications.controls; let i = index" [formGroupName]="i" class="qualification-item">
//           <strong>{{ getQualificationLabel(i) }}</strong>
    
//           <p>
//             <label>
//               {{ i < 2 ? 'School Name' : 'University Name' }}:
//             </label>
//             <input type="text" formControlName="instituteName" />
//             <span *ngIf="qualification.get('instituteName')?.touched && qualification.get('instituteName')?.invalid" class="error-message">
//               Institute Name is required.
//             </span>
//           </p>
    
//           <p>
//             <label>Percentage:</label>
//             <input type="text" formControlName="percentage" />
//             <span *ngIf="qualification.get('percentage')?.touched && qualification.get('percentage')?.invalid" class="error-message">
//               <span *ngIf="qualification.get('percentage')?.errors?.['required']">Percentage is required.</span>
//               <span *ngIf="qualification.get('percentage')?.errors?.['pattern']">Invalid percentage format.</span>
//             </span>
//           </p>
    
//           <p>
//             <label>Passing Year:</label>
//             <input type="text" formControlName="passingYear" />
//             <span *ngIf="qualification.get('passingYear')?.touched && qualification.get('passingYear')?.invalid" class="error-message">
//               <span *ngIf="qualification.get('passingYear')?.errors?.['required']">Passing Year is required.</span>
//               <span *ngIf="qualification.get('passingYear')?.errors?.['pattern']">Invalid year format (YYYY).</span>
//             </span>
//           </p>
    
//           <p *ngIf="i > 0">
//             <button type="button" (click)="removeQualification(i)">Remove</button>
//           </p>
//         </div>
//       </div>
      
//       <button type="button" (click)="addQualification()" [disabled]="qualifications.length >= 5">
//         Add Qualification
//       </button> <br> <br>

//       <div class="documents-container" *ngIf="documentsArray.controls.length > 0" formArrayName="documents">
//         <div *ngFor="let document of documentsArray.controls; let i = index" [formGroupName]="i" class="document-item">
//           <p>
//             <label>{{ document.get('documentLabel')?.value }}</label>
//             <input type="file" (change)="onFileSelected($event, i)" accept=".jpg, .png, .pdf">
//           </p>
          
//           <div *ngIf="document.get('previewUrl')?.value" class="document-preview">
//             <img [src]="document.get('previewUrl')?.value" width="50" height="50" (click)="openFullScreen(document.get('previewUrl')?.value)" class="clickable-image">                        
//           </div>
      
//           <p *ngIf="i > 0">
//             <button type="button" (click)="removeDocument(i)">Remove</button>
//           </p>
//         </div>
//       </div>  

//       <button type="button" (click)="addDocument()" [disabled]="documentsArray.length >= qualifications.length">
//           Add Document
//       </button>

//       <br/> <br/>
    
//       <button type="submit">Submit</button>
//     </form>
  
//   </div>
  
//   <div class="preview-container" *ngIf="submittedData">
//     <div *ngIf="submittedData">
//     <h2>Preview of Submitted Data</h2>
//     <hr>
//     <p><strong>First Name:</strong> {{ submittedData.firstname }}</p>
//     <p><strong>Last Name:</strong> {{ submittedData.lastname }}</p>
//     <p><strong>Gender:</strong> {{ submittedData.gender }}</p>
//     <p><strong>Permanent Address: </strong> {{ submittedData.permanentAddress }}</p>

//     <h3>Qualifications:</h3>
//     <div *ngFor="let qualification of submittedData.qualifications; let i = index" class="qualification-preview">
//       <p>
//         <strong>{{ getQualificationLabel(i) }}</strong><br>
//         <strong>Institute Name:</strong> {{ qualification.instituteName }}<br>
//         <strong>Percentage:</strong> {{ qualification.percentage }}%<br>
//         <strong>Passing Year:</strong> {{ qualification.passingYear }}
//       </p>
//     </div>

//     <h3>Documents:</h3>
//     <div *ngFor="let doc of submittedData.documents" class="document-preview-item">
//       <p><strong>{{ doc.documentLabel }}</strong></p>
      
//       <!-- <ng-container *ngIf="isImage(doc.previewUrl)">
//         <img [src]="doc.previewUrl" alt="Preview"
//          class="preview-image"
//          (click)="openFullScreen(doc.previewUrl)" />
//       </ng-container> -->
//       <ng-container *ngIf="isImage(doc.previewUrl)">
//         <img [src]="doc.previewUrl" alt="Preview"
//              class="preview-image"
//              (click)="openFullScreen(doc.previewUrl)" />
//       </ng-container>
      
//       <!-- Fullscreen Modal -->
//       <div class="modal" *ngIf="showModal" (click)="closeModal()">
//         <div class="modal-content" (click)="$event.stopPropagation()">
//           <img [src]="imageUrl" class="zoomable-image" />
//         </div>
//       </div>
      

//       <ng-container *ngIf="isPdf(doc.previewUrl)">
//         <p>PDF File Uploaded - <a (click)="openFullScreen(doc.previewUrl)">View</a></p>
//       </ng-container>
//     </div>
//     <button (click)="finalSubmit()" class="submit-button">Final Submit</button>
//   </div>

// </div>




