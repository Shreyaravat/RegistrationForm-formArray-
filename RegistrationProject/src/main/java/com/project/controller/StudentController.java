package com.project.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.StudentModel;
import com.project.repo.StudentRepo;
import com.project.service.ServiceClass;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:4200")

public class StudentController 
{

    @Autowired
    private ServiceClass studentService;
    
    @Autowired
    private StudentRepo studentRepository;
    
    @PostMapping("add")
    public ResponseEntity<StudentModel> createStudent(@RequestBody StudentModel obj ) {
    	
    	
    	System.out.println("Received student:" +obj);
  
        StudentModel savedStudent = studentService.saveStudent(obj);
        return ResponseEntity.ok(savedStudent);
    }
    
    //last
//    @GetMapping("/all")
//    public ResponseEntity<Page<StudentModel>> getAllStudents(Pageable pageable)
//    {
//    	Page<StudentModel> studentPage = studentService.getAllStudents(pageable);
//    	return ResponseEntity.ok(studentPage);
//    }
    //last
    
    @GetMapping("/all")
    public Page<StudentModel> getAllStudents(
            @RequestParam(defaultValue = "0") int page, 
            @RequestParam(defaultValue = "10") int size, 
            @RequestParam(required = false) String gender) {

        Pageable pageable = PageRequest.of(page, size);
        
        if (gender != null && !gender.isEmpty()) {
            return studentRepository.findByGender(gender, pageable);
        }
        
        return studentRepository.findAll(pageable);
    }


    

    @GetMapping("/{id}")
    public StudentModel getStudentById(@PathVariable int id)
    {
        return studentService.getStudentById(id);
    }

    @PutMapping("/update/{id}")
    public StudentModel updateStudent(@PathVariable int id, @RequestBody StudentModel updatedStudent) 
    {
        return studentService.updateStudent(id, updatedStudent);
    }

    @DeleteMapping("/delete/{id}")
	public ResponseEntity<?> deleteStudent(@PathVariable Integer id) 
    {
	    if (!studentRepository.existsById(id)) 
	    {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                .body("Student with ID " + id + " not found.");
	    }
 
	    studentRepository.deleteById(id);
	    Map<String, String> response = new HashMap<>();
	    response.put("message", "Student deleted successfully");
	    return ResponseEntity.ok(response);

	}
}


















//private static final String UPLOAD_DIR = "D:/marksheet"; // Save files in D:/uploads


//@PostMapping
//public StudentModel createStudent(@RequestBody StudentModel student) 
//{
//  System.out.println("Received Student Data: " + student.getQualifications().toPrettyString()); 
//  return studentService.saveStudent(student);
//}


//ArrayNode qualificationsArray = (ArrayNode) student.getQualifications();
//
//int fileIndex = 0;
//for (JsonNode qualification : qualificationsArray) {
//  if (qualification.has("documents")) {
//      ArrayNode newDocumentsArray = objectMapper.createArrayNode();
//
//      for (int i = 0; i < qualification.get("documents").size(); i++) {
//          if (files != null && fileIndex < files.length) {  // ✅ Check if files exist
//              newDocumentsArray.add(files[fileIndex].getOriginalFilename());
//              fileIndex++;
//          }
//      }
//      ((ObjectNode) qualification).set("documents", newDocumentsArray);
//  }
//}
//
//student.setQualifications(qualificationsArray);
//
//StudentModel savedStudent = studentService.saveStudent(student);
//return ResponseEntity.ok(savedStudent);




//@PostMapping("/upload")
//public String uploadFile(
//      @RequestParam("file") MultipartFile[] files, // Accept multiple files
//      @RequestParam("firstname") String firstname,
//      @RequestParam("lastname") String lastname,
//      @RequestParam("gender") String gender,
//      @RequestParam("permanentAddress") String permanentAddress,
//      @RequestParam("qualifications") String qualificationsJson
//) {
//  try
//  {
//      // Ensure directory exists
//      Files.createDirectories(Paths.get(UPLOAD_DIR));
//
//      // Generate a single ZIP file for all files
//      String randomFileName = UUID.randomUUID().toString() + ".zip";
//      Path zipFilePath = Paths.get(UPLOAD_DIR, randomFileName);
//
//      // Call compressFiles to zip all files together
//      compressFiles(files, zipFilePath.toString());
//
//      // Convert qualifications JSON string to JsonNode
//      ObjectMapper objectMapper = new ObjectMapper();
//      JsonNode qualifications = objectMapper.readTree(qualificationsJson);
//
//      // Add documentName field to each qualification
//      if (qualifications.isArray()) {
//          for (JsonNode node : qualifications) {
//              ((com.fasterxml.jackson.databind.node.ObjectNode) node).put("documentName", randomFileName);
//          }
//      }
//
//      // Save student details in DB
//      StudentModel student = new StudentModel();
//      student.setFirstname(firstname);
//      student.setLastname(lastname);
//      student.setGender(gender);
//      student.setPermanentAddress(permanentAddress);
//      student.setQualifications(qualifications);
//
//      studentService.saveStudent(student);
//
//      return "{ \"message\": \"Student registered successfully!\", \"fileName\": \"" + randomFileName + "\" }";
//
//  } catch (IOException e) {
//      e.printStackTrace();
//      return "{ \"error\": \"File upload failed\" }";
//  }
//}
//
//// Method to compress multiple files into a single ZIP
//private void compressFiles(MultipartFile[] files, String zipFilePath) throws IOException {
//  try (FileOutputStream fos = new FileOutputStream(zipFilePath);
//       ZipOutputStream zipOut = new ZipOutputStream(fos)) {
//
//      for (MultipartFile file : files) { // Loop through multiple files
//          try (InputStream fis = file.getInputStream()) {
//              ZipEntry zipEntry = new ZipEntry(file.getOriginalFilename());
//              zipOut.putNextEntry(zipEntry);
//
//              byte[] buffer = new byte[1024];
//              int len;
//              while ((len = fis.read(buffer)) > 0) {
//                  zipOut.write(buffer, 0, len);
//              }
//
//              zipOut.closeEntry();
//          }
//      }
//  }
//}



//@GetMapping("/files/{fileName}")
//public ResponseEntity<Resource> getFile(@PathVariable String fileName) throws IOException {
//  File file = new File("D:/uploads/" + fileName);
//  if (!file.exists()) {
//      return ResponseEntity.notFound().build();
//  }
//
//  Resource resource = new UrlResource(file.toURI());
//  return ResponseEntity.ok()
//          .contentType(MediaType.APPLICATION_OCTET_STREAM)
//          .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
//          .body(resource);
//}



//@GetMapping("/all")
//public List<StudentModel> getAllStudents() {
//  return studentService.getAllStudents();
//}





