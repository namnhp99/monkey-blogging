import slugify from "slugify";
import React, { useEffect } from "react";
import InputPasswordToggle from "components/input/InputPasswordToggle";
import AuthenticationLayout from "../components/layout/AuthenticationLayout";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { userRole, userStatus } from "utils/constants";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "components/label";
import { Input } from "components/input";
import { Field } from "components/field";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Button } from "components/button";
import { auth, db } from "firebase-app/firebase-config";
import {
  updateProfile,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const schema = yup.object({
  fullname: yup.string().required("Please enter your full name"),
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Please enter your email address"),
  password: yup
    .string()
    .required("Please enter your password")
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      "Password must contain at least 8 characters, one uppercase, one number and one special case character"
    ),
});
const SignUpPage = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    document.title = "Sign Up";
  }, []);
  useEffect(() => {
    const arrErrors = Object.values(errors);
    arrErrors.forEach((err) => {
      toast.error(err?.message, {
        pauseOnHover: false,
      });
    });
  }, [errors]);
  const handleSignUp = async (values) => {
    if (!isValid) return;
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      await updateProfile(auth.currentUser, {
        displayName: values.fullname,
      });
      await setDoc(doc(db, "users", auth.currentUser?.uid), {
        fullname: values.fullname,
        email: values.email,
        password: values.password,
        username: slugify(values.fullname, {
          lower: true,
          replacement: "",
          trim: true,
        }),
        avatar: "",
        status: userStatus.ACTIVE,
        role: userRole.USER,
        createdAt: serverTimestamp(),
      });
      toast.success("Register successfully!!!", {
        pauseOnHover: false,
      });
      reset({
        fullname: "",
        email: "",
        password: "",
      });
      await signOut(auth);
      navigate("/sign-in");
    } catch (error) {
      toast.error("Failed to register", {
        pauseOnHover: false,
      });
    }
  };

  return (
    <AuthenticationLayout>
      <form
        className="max-w-[600px] w-full"
        onSubmit={handleSubmit(handleSignUp)}
        autoComplete="off"
        aria-label="signup form"
      >
        <Field>
          <Label htmlFor="fullname">Full Name</Label>
          <Input
            type="text"
            name="fullname"
            placeholder="Enter your full name"
            control={control}
          ></Input>
        </Field>
        <Field>
          <Label htmlFor="email">Email address</Label>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            control={control}
          ></Input>
        </Field>
        <Field>
          <Label htmlFor="password">Password</Label>
          <InputPasswordToggle control={control}></InputPasswordToggle>
        </Field>
        <div className="mb-5 " aria-label="have account?">
          Already have an account?{" "}
          <Link
            to={"/sign-in"}
            className="font-medium text-primary hover:underline"
          >
            Sign In
          </Link>
        </div>
        <Button
          type="submit"
          className="w-full "
          disabled={isSubmitting}
          isLoading={isSubmitting}
          kind="primary"
        >
          Sign Up
        </Button>
      </form>
    </AuthenticationLayout>
  );
};

export default SignUpPage;
