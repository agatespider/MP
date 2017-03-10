package com.example001.web;

import com.example001.domain.User;
import com.example001.service.AuthService;
import com.example001.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 메인 페이지 컨트롤러
 * CSRF는 이번장에서는 사용 하지 않음.
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

@Controller
@RequestMapping
public class MainController {

    /**
     * 메인 페이지로 이동
     * @param model
     * @return view페이지 경로
     */
    @RequestMapping
    public String main(Model model) {
        return "index";
    }



}
