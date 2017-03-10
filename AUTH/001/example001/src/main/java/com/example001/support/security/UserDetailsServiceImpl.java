package com.example001.support.security;

import com.example001.domain.User;
import com.example001.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

/**
 * 로그인 인증을 위해서 UserDetailsService 구현체 개발
 * @author 조호영 (kofwhgh@gmail.com)
 * @since 2017.03.10
 * @version 0.1
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *  수정일       수정자    수정내용
 *  ----------  ------   ---------------------------
 *  2017.03.10  조호영    최초 작성
 *
 * </pre>
 */

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUserId(username);

        Set<GrantedAuthority> grantedAuthorities = new HashSet<>();
        grantedAuthorities.add(new SimpleGrantedAuthority("ROLE_USER"));    // 임의의 롤 ROLE_USER로 모두 매핑

        return new org.springframework.security.core.userdetails.User(user.getUserId(), user.getUserPassword(), grantedAuthorities);
    }
}
