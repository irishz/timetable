import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { variables } from "./Variables";
import { useState } from "react";
import { Alert, AlertIcon, AlertTitle } from "@chakra-ui/alert";
import { Button, Text } from "@chakra-ui/react";
import { MdLogin } from "react-icons/md";

function Login(props) {
  const userCredential = { username: "", password: "" };
  const [alertErrCredential, setalertErrCredential] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    userCredential.username = data.username;
    userCredential.password = data.password;

    axios
      .post(variables.API_URL + "token/", userCredential)
      .then((res) => {
        // console.log(res.data);
        localStorage.setItem("token", res.data.access);
        props.setuserToken(res.data.access);
      })
      .catch((err) => {
        if (err?.response) {
          if (err.response.status === 401) {
            setalertErrCredential("ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง!");
            setTimeout(() => {
              setalertErrCredential("");
            }, 3000);
          }
        }
      });
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-full h-screen justify-center items-center">
        <div className="flex flex-col w-1/4 h-1/2 border border-gray-300 rounded-lg justify-center p-5 shadow-md">
          {/* Input Username */}
          <div className="flex flex-col w-3/4">
            <Text color="teal">Username</Text>
            <input
              className={`border ${
                alertErrCredential ? "border-red-600" : "border-green-700"
              } rounded p-1`}
              {...register("username", { required: "กรุณาใส่ชื่อผู้ใช้" })}
              type="text"
              placeholder="Username"
            />
            {errors.username ? (
              <label className="text-red-500">{errors.username.message}</label>
            ) : null}
          </div>
          {/* Input Password */}
          <div className="flex flex-col w-3/4 my-2">
            <Text color="teal">Password</Text>
            <input
              className={`border ${
                alertErrCredential ? "border-red-600" : "border-green-700"
              } rounded p-1`}
              {...register("password", {
                required: "กรุณาใส่รหัสผ่าน",
                minLength: { value: 6, message: "รหัสผ่านขั้นต่ำ 6 ตัวอักษร" },
              })}
              type="password"
              placeholder="Password"
            />
          </div>
          {errors.password ? (
            <label className="text-red-500">{errors.password.message}</label>
          ) : null}
          {alertErrCredential ? (
            <Alert status="error" marginTop={1}>
              <AlertIcon />
              <AlertTitle>{alertErrCredential}</AlertTitle>
            </Alert>
          ) : null}
          <div className="m-5">
            <Button
              type="submit"
              variant="solid"
              colorScheme="teal"
              leftIcon={<MdLogin />}
            >
              เข้าสู่ระบบ
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Login;
