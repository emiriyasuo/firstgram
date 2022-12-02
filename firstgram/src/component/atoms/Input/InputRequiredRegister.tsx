import React, { useState } from "react";

function InputRequiredRegister(props: any) {
  return (
    <div>
      <span className="register_form_requiredIcon">＊</span>
      <input
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        pattern={props.pattern}
        data-equal-to={props.equal}
        className="input_required"
        // style={{
        //   width: "80%",
        //   height: "35px",
        //   backgroundColor: "#f7f7f7",
        //   outline: "solid #d3d3d3",
        //   border: "none",
        // }}
        required
      />
      <span className="input-error-message messageBox">
        正しい形式で入力してください({props.message})
        {props.errorMessage}
      </span>
    </div>
  );
}

export default InputRequiredRegister;
