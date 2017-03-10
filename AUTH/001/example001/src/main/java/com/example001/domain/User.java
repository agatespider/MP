package com.example001.domain;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Administrator on 2016-11-30.
 */

@Data
@Entity
@Table(name="TBL_USER", uniqueConstraints = {
    @UniqueConstraint( name = "UQ_USER_ID", columnNames = {"USER_ID"} ),
    @UniqueConstraint( name = "UQ_USER_EMAIL", columnNames = {"USER_EMAIL"} ),
    @UniqueConstraint( name = "UQ_USER_HP", columnNames = {"USER_HP"} )
})
public class User {
    // 유저 시퀀셜한 번호
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="USER_NO", nullable = false)
    private Long userNo;

    // 유저 로그인시에 사용하는 아이디
    @Column(name="USER_ID", nullable = false, length = 16)
    private String userId;

    // 유저 로그인시에 사용하는 패스워드
    @Column(name="USER_PASSWORD", nullable = false, length = 16)
    private String userPassword;

    // 유저명
    @Column(name="USER_NICK_NAME", length = 32)
    private String userNickName;

    // 유저이메일
    @Column(name="USER_EMAIL", nullable = false, length = 128)
    private String userEmail;

    // 유저 핸드폰 번호
    @Column(name="USER_HP", length = 12)
    private String userHp;

    // 생성일(회원 가입일)
    @Column(name="REG_DATE", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date regDate;

    // 새로운 row가 쌓이기 전에 날자 세팅
    @PrePersist
    private void createRegDate() {
        this.regDate = new Date();
    }
}
