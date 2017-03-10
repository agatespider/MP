package com.example001.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;

/**
 * Spring Security 설정을 담당.
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

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsService userDetailsService;

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
            .csrf().and()
			.authorizeRequests()
			.antMatchers("/resources/**", "/auth/regist").permitAll()
			.anyRequest().authenticated()
			.and()
			.formLogin()
			.loginPage("/auth/login")
			.permitAll()
			.and()
			.logout()
			.permitAll();
	}

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService);
    }
}