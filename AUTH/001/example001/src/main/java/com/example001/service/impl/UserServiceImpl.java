package com.example001.service.impl;

import com.example001.domain.User;
import com.example001.repository.UserRepository;
import com.example001.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by Administrator on 2016-12-03.
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void save(User user) {
        userRepository.save(user);
    }

    @Override
    public User findByUserId(String userId) {
        return userRepository.findByUserId(userId);
    }

    @Override
    public User findByUserNo(Long userNo) {
        return userRepository.findByUserNo(userNo);
    }
}
