package com.example001.service;

import com.example001.domain.User;

/**
 * Created by Administrator on 2016-12-03.
 */
public interface UserService {
    public void save(User user);
    public User findByUserId(String userId);
    public User findByUserNo(Long userNo);
}
