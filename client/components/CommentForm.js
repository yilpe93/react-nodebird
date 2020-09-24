import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Form, Input, Button } from "antd";
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
`;

const CommentForm = ({ post }) => {
  const id = useSelector((state) => state.user.me?.id);

  const [commentText, onChangeCommentText] = useInput("");

  const onSubmitComment = useCallback(() => {
    console.log(commentText);
  }, [commentText]);

  return (
    <Form onFinish={onSubmitComment}>
      <Item>
        <TextArea value={commentText} onChange={onChangeCommentText} rows={4} />
        <Btn type="primary" htmlType="submit">
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
