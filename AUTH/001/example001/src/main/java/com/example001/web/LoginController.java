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
 * 로그인, 회원가입을 담당하는 컨트롤러
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
@RequestMapping("/auth")
public class LoginController {

    @Autowired
    private UserService userSerivce;

    @Autowired
    private AuthService authService;

    /**
     * 로그인 페이지로 이동
     * @param model
     * @return view페이지 경로
     */
    @RequestMapping("/login")
    public String login(Model model) {
        return "auth/login";
    }

    /**
     * 회원가입 페이지로 이동
     * @return view페이지 경로
     */
    @RequestMapping(value="/regist", method=RequestMethod.GET)
    public String regist() {
        return "auth/regist";
    }

    /**
     * UserForm을 받아서 회원가입, 가입성공시 자동 로그인을 한다.
     * @param userForm : 회원가입 양식
     * @param model
     * @return view페이지 경로
     */
    @RequestMapping(value="/regist", method=RequestMethod.POST)
    public String regist(@ModelAttribute("userForm") User userForm, Model model) {
        userSerivce.save(userForm);
        authService.autoLogin(userForm.getUserId(), userForm.getUserPassword());

        return "redirect:/";
    }

}
