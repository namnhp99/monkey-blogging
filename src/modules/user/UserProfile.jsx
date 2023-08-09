import { Button } from "components/button";
import { Field } from "components/field";
import ImageUpload from "components/image/ImageUpload";
import { Input } from "components/input";
import InputPasswordToggle from "components/input/InputPasswordToggle";
import { Label } from "components/label";
import DashboardHeading from "modules/dashboard/DashboardHeading";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "react-day-picker/dist/style.css";
import "flatpickr/dist/flatpickr.css";
import Flatpickr from "react-flatpickr";
import { useRef } from "react";
const UserProfile = () => {
  const [, setDate] = useState(new Date());
  const fp = useRef(null);
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
    setValue,
  } = useForm({
    mode: "onChange",
  });
  const handleUpdateProfile = (values) => {
    if (!isValid) return;
  };
  const handleDaySelected = (dateSelect) => {
    setValue("birthday", new Date(dateSelect[0]).toLocaleDateString("en-GB"));
    setDate(dateSelect);
  };
  return (
    <div>
      <DashboardHeading title="Account information"></DashboardHeading>
      <form autoComplete="off" onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="w-[200px] h-[200px] mx-auto mb-10">
          <ImageUpload className="!rounded-full h-full"></ImageUpload>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Fullname</Label>
            <Input
              control={control}
              name="fullname"
              placeholder="Enter your fullname"
            ></Input>
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              control={control}
              name="username"
              placeholder="Enter your username"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Date of Birth</Label>
            <div
              className="w-full relative h-[56px] cursor-pointer"
              onClick={() => {
                if (!fp.current.flatpickr) return;
                fp.current.flatpickr.open();
              }}
            >
              <Flatpickr
                ref={fp}
                placeholder="Select a day"
                options={{
                  dateFormat: "d/m/Y",
                  position: "auto right",
                  locale: {
                    firstDayOfWeek: 1,
                  },
                  minDate: "1/1/1920",
                  maxDate: "today",
                }}
                onChange={handleDaySelected}
                className="w-full h-full date-picker"
              />
              <span className="absolute top-[50%] right-0 -translate-x-[50%] -translate-y-[50%] ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                  />
                </svg>
              </span>
            </div>
          </Field>
          <Field>
            <Label>Mobile Number</Label>
            <Input
              control={control}
              name="phonenumber"
              placeholder="Enter your phone number"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              control={control}
              name="email"
              type="email"
              placeholder="Enter your email address"
            ></Input>
          </Field>
          <Field></Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>New Password</Label>
            <InputPasswordToggle control={control}></InputPasswordToggle>
          </Field>
          <Field>
            <Label>Confirm Password</Label>
            <InputPasswordToggle
              control={control}
              name="confirmpassword"
            ></InputPasswordToggle>
          </Field>
        </div>
        <Button
          type="submit"
          kind="primary"
          className="mx-auto w-[200px]"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Update
        </Button>
      </form>
    </div>
  );
};

export default UserProfile;
