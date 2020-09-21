import React from "react";
import Head from "next/head";
import AppLayout from "../components/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";

const Profile = () => {
  const followingList = [
    {
      nickname: "킴재쿤",
    },
    { nickname: "바보" },
    { nickname: "멍청이" },
  ];
  const followerList = [
    {
      nickname: "킴재쿤",
    },
    { nickname: "바보" },
    { nickname: "멍청이" },
  ];

  return (
    <>
      <Head>
        <title>프로필 | NodeBird</title>
      </Head>

      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉 목록" data={followingList} />
        <FollowList header="팔로워 목록" data={followerList} />
      </AppLayout>
    </>
  );
};

export default Profile;
