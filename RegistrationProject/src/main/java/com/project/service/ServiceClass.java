package com.project.service;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;
import java.util.Iterator;
import java.util.UUID;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.FileImageOutputStream;
import javax.imageio.stream.ImageOutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.project.StudentModel;
import com.project.repo.StudentRepo;
//import org.springframework.util.Base64Utils;


@Service
public class ServiceClass 
{
    @Autowired
    private StudentRepo studentRepository;
    
    @Autowired
    private ObjectMapper objectMapper;

//    public StudentModel saveStudent(StudentModel student) 
//    {
//        return studentRepository.save(student);
//    }

//    public StudentModel saveStudent(StudentModel student) {
//        JsonNode qualifications = student.getQualifications();
//
//        if (qualifications != null && qualifications.isArray()) {
//            ArrayNode arrayNode = (ArrayNode) qualifications;
//
//            for (JsonNode node : arrayNode) {
//                if (node.has("documents")) {
//                    String originalValue = node.get("documents").asText();
//                    
//                    // Check if the value is Base64
//                    if (originalValue.startsWith("data:image")) {
//                        // Extract only the filename (Assuming filename is passed separately in frontend)
//                        String fileName = extractFileName(originalValue);
//                        
//                        ((ObjectNode) node).put("documents", fileName); // Replace base64 with filename
//                    }
//                }
//            }
//        }
//
//        student.setQualifications(qualifications);
//        return studentRepository.save(student);
//    }
//
//    private String extractFileName(String base64String) {
//        // Default name (modify if filename is sent from frontend)
//        return "uploaded_image.png";
//    }
       

    private static final String SAVE_DIRECTORY = "D:\\marksheet"; // Folder path


    public StudentModel saveStudent(StudentModel student) {
        JsonNode qualifications = student.getQualifications();

        if (qualifications != null && qualifications.isArray()) {
            ArrayNode arrayNode = (ArrayNode) qualifications;

            for (JsonNode node : arrayNode) {
                if (node.has("documents")) {
                    String originalValue = node.get("documents").asText();

                    if (originalValue.startsWith("data:image")) {

                    	String fileName = generateRandomFileName(originalValue);

                        boolean isSaved = saveCompressedImageToDisk(originalValue, fileName);

                        if (isSaved) {
                            ((ObjectNode) node).put("documents", fileName);
                        } else {
                            ((ObjectNode) node).put("documents", "Error saving file");
                        }
                    }
                }
            }
        }

        student.setQualifications(qualifications);
        return studentRepository.save(student);
    }

    private String generateRandomFileName(String base64String) {
        return UUID.randomUUID().toString() + ".jpg"; // Always save as compressed JPEG
    }

    private boolean saveCompressedImageToDisk(String base64String, String fileName) {
        try {
            String base64Data = base64String.split(",")[1]; // Remove data URI prefix
            byte[] decodedBytes = Base64.getDecoder().decode(base64Data);

            InputStream inputStream = new ByteArrayInputStream(decodedBytes);
            BufferedImage image = ImageIO.read(inputStream); // Convert to BufferedImage

            if (image == null) {
                return false; // Invalid image data
            }

            File directory = new File(SAVE_DIRECTORY);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            File file = new File(directory, fileName);
            return compressAndSaveImage(image, file);

        } catch (IOException | ArrayIndexOutOfBoundsException e) {
            e.printStackTrace();
            return false;
        }
    }

    
    private boolean compressAndSaveImage(BufferedImage image, File file) {
        try {
            // Ensure image is in RGB format (JPEG does not support CMYK or ARGB)
            BufferedImage rgbImage = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);
            Graphics2D g = rgbImage.createGraphics();
            g.drawImage(image, 0, 0, null);
            g.dispose();

            Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpg");
            if (!writers.hasNext()) {
                return false; // No JPEG writer available
            }

            ImageWriter writer = writers.next();
            ImageWriteParam param = writer.getDefaultWriteParam();
            param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            param.setCompressionQuality(0.5f); // 50% compression for reduced size

            try (ImageOutputStream output = new FileImageOutputStream(file)) {
                writer.setOutput(output);
                writer.write(null, new IIOImage(rgbImage, null, null), param);
            }

            writer.dispose();
            return true;

        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }


    
	public Page<StudentModel> getAllStudents(Pageable pageable) {
	    return studentRepository.findAll(pageable);
	}

    

    public StudentModel getStudentById(int id) 
    {
        return studentRepository.findById(id).orElse(null);
    }

    public StudentModel updateStudent(int id, StudentModel updatedStudent)
    {
        StudentModel existingStudent = studentRepository.findById(id).orElse(null);
        if (existingStudent != null) 
        {
            existingStudent.setFirstname(updatedStudent.getFirstname());
            existingStudent.setLastname(updatedStudent.getLastname());
            existingStudent.setGender(updatedStudent.getGender());
            existingStudent.setPermanentAddress(updatedStudent.getPermanentAddress());
            existingStudent.setQualifications(updatedStudent.getQualifications());
            return studentRepository.save(existingStudent);
        }
        return null;
    }

    public void deleteStudent(int id)
    {
        studentRepository.deleteById(id);
    }
}



//public List<StudentModel> getAllStudents() 
//{
//  return studentRepository.findAll();
//}



//private boolean compressAndSaveImage(BufferedImage image, File file) {
//  try {
//      Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpg");
//      if (!writers.hasNext()) {
//          return false; // No JPG writers available
//      }
//
//      ImageWriter writer = writers.next();
//      ImageWriteParam param = writer.getDefaultWriteParam();
//      param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
//      param.setCompressionQuality(0.5f); // 50% compression for reduced size
//
//      try (ImageOutputStream output = new FileImageOutputStream(file)) {
//          writer.setOutput(output);
//          writer.write(null, new IIOImage(image, null, null), param);
//      }
//
//      writer.dispose();
//      return true;
//
//  } catch (IOException e) {
//      e.printStackTrace();
//      return false;
//  }
//}
