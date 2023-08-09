import { Button } from "components/button";
import { Field } from "components/field";
import { Input } from "components/input";
import { Label } from "components/label";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import AuthenticationLayout from "../components/layout/AuthenticationLayout";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "firebase-app/firebase-config";
import { Link, useNavigate } from "react-router-dom";
import InputPasswordToggle from "components/input/InputPasswordToggle";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import slugify from "slugify";
import { userRole, userStatus } from "utils/constants";
const schema = yup.object({
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
const SignInPage = () => {
  const [user] = useAuthState(auth);
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    document.title = "Sign In";
    if (user) navigate("/");
  }, [navigate, user]);
  useEffect(() => {
    const arrErrors = Object.values(errors);
    arrErrors.forEach((err) => {
      toast.error(err?.message, {
        pauseOnHover: false,
      });
    });
  }, [errors]);

  const handleSignIn = async (values) => {
    if (!isValid) return;
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      navigate("/");
    } catch (error) {
      toast.error("Email or password is wrong!");
    }
  };
  const handleSignInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      await setDoc(doc(db, "users", user.uid), {
        fullname: user.displayName,
        email: user.email,
        username: slugify(user.displayName, {
          lower: true,
          replacement: "",
          trim: true,
        }),
        avatar: user.photoURL,
        status: userStatus.ACTIVE,
        role: userRole.USER,
        createdAt: serverTimestamp(),
      });
      navigate("/");
    } catch (error) {
      toast(error.message);
    }
  };
  return (
    <AuthenticationLayout>
      <form
        className="max-w-[600px] w-full"
        onSubmit={handleSubmit(handleSignIn)}
        autoComplete="off"
        aria-label="signin form"
      >
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
          Not have an account?{" "}
          <Link
            to={"/sign-up"}
            className="font-medium text-primary hover:underline"
          >
            Create an account
          </Link>
        </div>
        <Button
          type="submit"
          className="w-full mx-auto mb-2"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          kind="primary"
        >
          Sign In
        </Button>
        <div className="flex flex-col text-center gap-y-3 ">
          <span>or</span>
          <Button
            className="border gap-x-3  bg-transparent border-[#D1FBD6] hover:bg-primary hover:text-white hover:border-transparent transition-all"
            onClick={handleSignInWithGoogle}
          >
            <img src="/googleicon.png" alt="" className="w-4 h-4" />
            <span>Sign In With Google</span>
          </Button>
        </div>
      </form>
    </AuthenticationLayout>
  );
};

export default SignInPage;
