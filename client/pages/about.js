import React, { useEffect } from "react";
import styled from "styled-components";
import Router from "next/router";
import { useSelector } from "react-redux";
import Head from "next/head";
import { END } from "redux-saga";

import { Avatar, Card } from "antd";
import AppLayout from "../components/AppLayout";
import wrapper from "../store/configureStore";
import { LOAD_USER_REQUEST } from "../reducers/user";

const ProfileCard = styled(Card)`
  .ant-card-actions li {
    width: 33.3% !important;
  }
`;

const About = () => {
  const { userInfo, loadUserError } = useSelector((state) => state.user);

  useEffect(() => {
    if (loadUserError) {
      alert(loadUserError);
      Router.replace("/");
    }
  }, [loadUserError]);

  return (
    <AppLayout>
      <Head>{userInfo.nickname} | NodeBird</Head>
      {userInfo ? (
        <ProfileCard
          actions={[
            <div key="twit">
              짹짹
              <br />
              {userInfo.Posts}
            </div>,
            <div key="followings">
              팔로잉
              <br />
              {userInfo.Followings}
            </div>,
            ,
            <div key="followers">
              팔로워
              <br />
              {userInfo.Followers}
            </div>,
          ]}
        >
          <Card.Meta
            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
            title={userInfo.nickname}
          />
        </ProfileCard>
      ) : null}
    </AppLayout>
  );
};

export const getStaticProps = wrapper.getStaticProps(async (context) => {
  context.store.dispatch({
    type: LOAD_USER_REQUEST,
    data: 1,
  });

  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default About;
