import React, { useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import { useSelector } from "react-redux";

import AppLayout from "../components/AppLayout";
import InfoEditForm from "../components/InfoEditForm";
import FollowList from "../components/FollowList";

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  useEffect(() => {
    if (!(me && me.id)) {
      Router.push("/");
    }
  }, [me && me.id]);

  if (!me) {
    return null;
  }

  return (
    <>
      <Head>
        <title>프로필 | NodeBird</title>
      </Head>

      <AppLayout>
        <InfoEditForm />
        <FollowList header="팔로잉 목록" data={me.Followings} />
        <FollowList header="팔로워 목록" data={me.Followers} />
      </AppLayout>
    </>
  );
};

export default Profile;
