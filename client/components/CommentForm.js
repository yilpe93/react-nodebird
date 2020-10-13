import React, { useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Form, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addCommentRequest } from "../reducers/post";
import useInput from "../hooks/useInput";

const Item = styled(Form.Item)`
  position: relative;
  margin: 0;
`;

const TextArea = styled(Input.TextArea)`
  // margin-bottom: 10px;
`;

const Btn = styled(Button)`
  position: absolute;
  right: 0;
  bottom: -40px;
  z-index: 1;
`;

const CommentForm = ({ post }) => {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.user.me?.id);
  const { addCommentDone, addCommentLoading } = useSelector(
    (state) => state.post
  );

  const [commentText, onChangeCommentText, setCommentText] = useInput("");

  useEffect(() => {
    if (addCommentDone) {
      setCommentText("");
    }
  }, [addCommentDone]);

  const onSubmitComment = useCallback(() => {
    dispatch(
      addCommentRequest({
        content: commentText,
        postId: post.id,
        userId: id,
      })
    );
  }, [commentText, id]);

  return (
    <Form onFinish={onSubmitComment}>
      <Item>
        <TextArea value={commentText} onChange={onChangeCommentText} rows={4} />
        <Btn type="primary" htmlType="submit" loading={addCommentLoading}>
          삐약
        </Btn>
      </Item>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;
