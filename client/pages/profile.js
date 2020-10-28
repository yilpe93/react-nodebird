import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Router from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
} from "../reducers/user";
import AppLayout from "../components/AppLayout";
import InfoEditForm from "../components/InfoEditForm";
import FollowList from "../components/FollowList";

import axios from "axios";
import useSWR from "swr";

const fetcher = (url) =>
  axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  // const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);

  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  const { data: followersData, error: followerError } = useSWR(
    `http://localhost:3065/api/user/followers?limit=${followersLimit}`,
    fetcher
  );
  const { data: followingsData, error: followingError } = useSWR(
    `http://localhost:3065/api/user/followings?limit=${followingsLimit}`,
    fetcher
  );

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push("/");
    }
  }, [me && me.id]);

  if (!me) {
    return "내 정보 로딩중...";
  }

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  });

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  });

  if (followerError || followingError) {
    console.error(followerError || followingError);
    return "팔로잉/팔로워 로딩 중 에러가 발생합니다.";
  }

  return (
    <>
      <Head>
        <title>프로필 | NodeBird</title>
      </Head>

      <AppLayout>
        <InfoEditForm />
        <FollowList
          header="팔로잉 목록"
          onClickMore={loadMoreFollowings}
          data={followingsData}
          loading={!followersData && !followerError}
        />
        <FollowList
          header="팔로워 목록"
          onClickMore={loadMoreFollowers}
          data={followersData}
          loading={!followingsData && !followingError}
        />
      </AppLayout>
    </>
  );
};

export default Profile;
