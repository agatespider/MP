package com.example001.repository;

import com.example001.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


@RepositoryRestResource
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUserId(String userId);
    User findByUserNo(Long userNo);
}
