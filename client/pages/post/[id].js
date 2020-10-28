// post/[id].js
import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { END } from "redux-saga";
import { useSelector } from "react-redux";
import axios from "axios";

import { LOAD_POST_REQUEST } from "../../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import wrapper from "../../store/configureStore";
import AppLaout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";

const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  const { singlePost, loadPostError } = useSelector((state) => state.post);

  useEffect(() => {
    if (loadPostError) {
      alert(loadPostError);
      Rotuer.replace("/");
    }
  }, [loadPostError]);

  return (
    <AppLaout>
      <Head>
        <title>{singlePost.User.nickname}님의 글</title>
        <meta name="description" content={singlePost.content} />
        {/* 미리보기 타이틀 */}
        <meta
          property="og:title"
          content={`${singlePost.User.nickname}님의 게시글`}
        />
        {/* 미리보기 설명 */}
        <meta property="og:description" content={singlePost.content} />
        {/* 미리보기 이미지 */}
        <meta
          property="og:image"
          content={singlePost.Images[0] ? singlePost.Images[0].src : null}
        />
        {/* 미리보기 링크 클릭시 이동 url */}
        <meta property="og:url" conten={`/post/${id}`} />
      </Head>
      <PostCard post={singlePost} />
    </AppLaout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }

    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });

    context.store.dispatch({
      type: LOAD_POST_REQUEST,
      data: context.params.id,
    });

    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  }
);

export default Post;
