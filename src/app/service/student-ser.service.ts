import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentSerService {
  
  private baseUrl = 'http://localhost:8080/api/students'; // Backend API ka base URL

  constructor(private http: HttpClient) {}

  // getAllStudents(page: number, size: number): Observable<any> {
  //   if (page === undefined || size === undefined) {
  //     console.error("Pagination parameters are undefined", { page, size });
  //     return throwError(() => new Error('Invalid pagination parameters.'));
  //   }
 
  //   const params = new HttpParams()
  //     .set('page', page.toString())
  //     .set('size', size.toString());
 
  //   console.log(`Fetching students from API: ${this.baseUrl}/all?${params.toString()}`);
 
  //       // return this.http.get(this.baseUrl, { params }).pipe(
  //       return this.http.get(`${this.baseUrl}/all`, { params }).pipe(

  //       catchError((error) => {
  //       console.error('Error fetching students:', error);
  //       return throwError(() => new Error('Error fetching students, please try again later.'));
  //     })
  //   );
  // }  

  getAllStudents(page: number, size: number, gender?: string): Observable<any> {
    if (page === undefined || size === undefined) {
      console.error("Pagination parameters are undefined", { page, size });
      return throwError(() => new Error('Invalid pagination parameters.'));
    }
 
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // Gender filter ko query params me add karein agar gender select hua hai
    if (gender) {
        params = params.set('gender', gender);
    }
 
    console.log(`Fetching students from API: ${this.baseUrl}/all?${params.toString()}`);
 
    return this.http.get(`${this.baseUrl}/all`, { params }).pipe(
        catchError((error) => {
            console.error('Error fetching students:', error);
            return throwError(() => new Error('Error fetching students, please try again later.'));
        })
    );
}  

  getStudentById(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${studentId}`);
  }

  addStudent(studentData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, studentData);
  }

  updateStudent(studentId: number, studentData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${studentId}`, studentData);
  }

  deleteStudent(studentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${studentId}` , { responseType: 'text' });
    }
}





  // getAllStudents(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.baseUrl}/all`);
  // }

   // getPaginatedStudents(page: number, size: number): Observable<any> {
    //   if (isNaN(page) || page < 0) {
    //     page = 0; // Default to page 0 if invalid
    //   }
    //   if (isNaN(size) || size <= 0) {
    //     size = 10; // Default page size
    //   }    
    //   return this.http.get<any>(`${this.baseUrl}/all?page=${page}&size=${size}`);
    // }
    



