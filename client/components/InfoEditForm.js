import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input } from "antd";
import { CHANGE_INFO_REQUEST } from "../reducers/user";
import useInput from "../hooks/useInput";

const InfoEditForm = () => {
  const dispatch = useDispatch();
  const { me, changeInfoDone } = useSelector((state) => state.user);
  const [nickname, onChangeNickname, setNickname] = useInput(
    me?.nickname || ""
  );

  const style = useMemo(() => ({
    marginBottom: "20px",
    border: "1px solid #d9d9d9",
    padding: "20px",
  }));

  useEffect(() => {
    if (changeInfoDone) {
      setNickname("");
    }
  }, [changeInfoDone]);

  const onSubmit = useCallback(() => {
    dispatch({
      type: CHANGE_INFO_REQUEST,
      data: nickname,
    });
  }, [nickname]);

  return (
    <Form style={style}>
      <Input.Search
        value={nickname}
        onChange={onChangeNickname}
        addonBefore="닉네임"
        enterButton="수정"
        onSearch={onSubmit}
      />
    </Form>
  );
};

export default InfoEditForm;
