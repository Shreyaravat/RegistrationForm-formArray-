package com.project.repo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.StudentModel;

@Repository
public interface StudentRepo extends JpaRepository<StudentModel, Integer> 
{
	Page<StudentModel> findByGender(String gender, Pageable pageable);
//	Page<StudentModel> findByQualifications_QualificationLevel(String qualification, Pageable pageable);
}