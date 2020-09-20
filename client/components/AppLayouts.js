import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Link from "next/link";
import { Menu, Input, Row, Col } from "antd";

import UserProfile from "../components/UserProfile";
import LoginForm from "../components/LoginForm";

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

const AppLayouts = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/">
            <a>노드버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <SearchInput enterButton />
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup">
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>

      {/* gutter => column 사이의 간격 조절 */}
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {isLoggedIn ? (
            <UserProfile setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <LoginForm setIsLoggedIn={setIsLoggedIn} />
          )}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          {/* 
            # target="_blank" 새창으로 띄우기로 많이 쓰이나 해당 보안상 문제가 될 수 있으므로 rel="noreferrer noopener" 속성과 같이 사용한다.
          */}
          <a
            href="https://yilpe93.github.io"
            target="_blank"
            rel="noreferrer noopener"
          >
            Made by Jkun
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayouts.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayouts;
