import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Form, Input, Button } from "antd";
import Link from "next/link";
// custom hooks
import useInput from "../hooks/useInput";

/* 
  # useCallback - 함수를 캐싱, props로 함수를 전달할 때 사용
  # useMemo - 값을 캐싱
  
  const style = useMemo(() => (
    {
      marginTop: 10;
    }
  ), []);
*/

const ButtonWrapper = styled.div`
  margin-top: 10px;
  text-align: center;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

const LoginButton = styled(Button)`
  margin-right: 10px;
`;

const LoginForm = ({ setIsLoggedIn }) => {
  const [id, onChangeId] = useInput("");
  const [password, onChangePassword] = useInput("");

  const onSubmitForm = useCallback(() => {
    console.log(id, password);
    setIsLoggedIn(true);
  }, [id, password]);

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor="user-id">아이디</label>
        <br />
        <Input name="user-id" value={id} onChange={onChangeId} required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input
          name="user-password"
          type="password"
          value={password}
          onChange={onChangePassword}
          required
        />
      </div>
      <ButtonWrapper>
        <LoginButton type="primary" htmlType="submit" loading={false}>
          로그인
        </LoginButton>
        <Link href="/signup">
          <a>
            <Button>회원가입</Button>
          </a>
        </Link>
      </ButtonWrapper>
    </FormWrapper>
  );
};

LoginForm.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
};

export default LoginForm;
