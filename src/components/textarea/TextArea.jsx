import React from "react";
import { useController } from "react-hook-form";
import styled from "styled-components";
const TextAreaStyles = styled.div`
  width: 100%;
  position: relative;
  textarea {
    width: 100%;
    padding: 15px 15px;
    border-radius: 8px;
    font-weight: 400;
    border: 1px solid ${(props) => props.theme.grayf1};
    transition: all 0.2s linear;
    resize: none;
    min-height: 200px;
    :focus {
      background-color: white;
      border-color: ${(props) => props.theme.black};
    }
    ::-webkit-input-placeholder {
      color: #84878b;
    }
    ::-moz-input-placeholder {
      color: #84878b;
    }
  }
`;
const TextArea = ({ control, name = "", type = "text", ...props }) => {
  const { field } = useController({
    control,
    name,
    defaultValue: "",
  });
  return (
    <TextAreaStyles>
      <textarea id={name} type={type} {...field} {...props}></textarea>
    </TextAreaStyles>
  );
};

export default TextArea;
