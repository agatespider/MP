package com.example001.config;

import nz.net.ultraq.thymeleaf.LayoutDialect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.thymeleaf.extras.springsecurity4.dialect.SpringSecurityDialect;
import org.thymeleaf.spring4.SpringTemplateEngine;
import org.thymeleaf.templateresolver.TemplateResolver;

/**
 * View 설정 담당.
 * @author 조호영 (kofwhgh@gmail.com)
 * @since 2017.03.10
 * @version 0.1
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *   
 *  수정일      수정자    수정내용
 *  ----------  ------    ---------------------------
 *  2017.03.10  조호영    최초 작성
 *
 * </pre>	
 */

@Configuration
public class ViewConfig extends WebMvcConfigurerAdapter {

	@Autowired
	private TemplateResolver templateResolver;

	// resources 요청시 응답위치를 /resources/로 설정.
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/resources/**").addResourceLocations("/resources/");
	}

	@Bean
	public SpringTemplateEngine templateEngine() {
		SpringTemplateEngine templateEngine = new SpringTemplateEngine();
		templateEngine.setTemplateResolver(templateResolver);
		templateEngine.addDialect(new LayoutDialect());
		templateEngine.addDialect(new SpringSecurityDialect());
		return templateEngine;
	}
}