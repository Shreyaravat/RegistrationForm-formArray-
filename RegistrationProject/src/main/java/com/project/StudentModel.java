
//package com.project;
//
//import java.util.List;
//
//import org.hibernate.annotations.JdbcTypeCode;
//import org.hibernate.type.SqlTypes;
//
//import com.fasterxml.jackson.databind.JsonNode;
//
//import jakarta.persistence.Column;
//import jakarta.persistence.Entity;
//import java.util.List;
//
//public class StudentModel {
//    private String firstname;
//    private String lastname;
//    private String gender;
//    private String permanentAddress;
//    private List<QualificationDto> qualifications; 
//
//    // Getters & Setters
//    public String getFirstname() {
//        return firstname;
//    }
//    public void setFirstname(String firstname) {
//        this.firstname = firstname;
//    }
//
//    public String getLastname() {
//        return lastname;
//    }
//    public void setLastname(String lastname) {
//        this.lastname = lastname;
//    }
//
//    public String getGender() {
//        return gender;
//    }
//    public void setGender(String gender) {
//        this.gender = gender;
//    }
//
//    public String getPermanentAddress() {
//        return permanentAddress;
//    }
//    public void setPermanentAddress(String permanentAddress) {
//        this.permanentAddress = permanentAddress;
//    }
//
//    public List<QualificationDto> getQualifications() {
//        return qualifications;
//    }
//    public void setQualifications(List<QualificationDto> qualifications) {
//        this.qualifications = qualifications;
//    }
//}




package com.project;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.databind.JsonNode;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "studentform_details")

public class StudentModel
{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)

	private int id;
	private String firstname;
	private String lastname;
	private String gender;
	private String permanentAddress;

	@Column(columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)       // field store in JSON format
    private JsonNode qualifications;   //  represent json data
	
	public int getId() 
	{
		return id;
	}

	public String getFirstname() 
	{
		return firstname;
	}

	public void setFirstname(String firstname) 
	{
		this.firstname = firstname;
	}

	public String getLastname() 
	{
		return lastname;
	}

	public void setLastname(String lastname) 
	{
		this.lastname = lastname;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) 
	{
		this.gender = gender;
	}

	public String getPermanentAddress() 
	{
		return permanentAddress;
	}

	public void setPermanentAddress(String permanentAddress) 
	{
		this.permanentAddress = permanentAddress;
	}	

	public JsonNode getQualifications() 
	{
		return qualifications;
	}

	public void setQualifications(JsonNode qualifications) 
	{
		this.qualifications = qualifications;
	}

	public StudentModel(int id, String firstname, String lastname, String gender, String permanentAddress,
			 JsonNode qualifications)
	{
		this.id = id;
		this.firstname = firstname;
		this.lastname = lastname;
		this.gender = gender;
		this.permanentAddress = permanentAddress;
		this.qualifications = qualifications;
	}

	public StudentModel()
	{ }

	@Override
	public String toString()
	{
		return "StudentModel [id=" + id + ", firstname=" + firstname + ", lastname=" + lastname + ", gender=" + gender
				+ ", permanentAddress=" + permanentAddress + ", qualifications="
				+ qualifications + "]";
	}	
}

