import useFirebaseImage from "hooks/useFirebaseImage";
import slugify from "slugify";
import React from "react";
import InputPasswordToggle from "components/input/InputPasswordToggle";
import ImageUpload from "components/image/ImageUpload";
import DashboardHeading from "modules/dashboard/DashboardHeading";
import { userRole, userStatus } from "utils/constants";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { TextArea } from "components/textarea";
import { Radio } from "components/checkbox";
import { Label } from "components/label";
import { Input } from "components/input";
import { Field, FieldCheckboxes } from "components/field";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "firebase-app/firebase-config";
import { Button } from "components/button";

const UserUpdate = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
    watch,
    reset,
    getValues,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {},
  });
  const navigate = useNavigate();
  const imageUrl = getValues("avatar");
  const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl);
  const imageName = imageRegex?.length > 0 ? imageRegex[1] : "";
  const { image, progress, handleSelectImage, handleDeleteImage, setImage } =
    useFirebaseImage(getValues, setValue, imageName, deleteAvatar);
  const [params] = useSearchParams();
  const userId = params.get("id");
  const watchStatus = watch("status");
  const watchRole = watch("role");
  useEffect(() => {
    document.title = "Update User";
  }, []);
  useEffect(() => {
    if (!userId) return null;
    const fetchData = async () => {
      const colRef = doc(db, "users", userId);
      const docData = await getDoc(colRef);
      reset(docData && docData.data());
    };
    fetchData();
  }, [reset, userId]);
  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl, setImage]);
  const handleUpdateUser = async (values) => {
    if (!isValid) return;
    try {
      const docRef = doc(db, "users", userId);
      await updateDoc(docRef, {
        ...values,
        username: slugify(values.username || values.fullname, {
          lower: true,
          replacement: "",
          trim: true,
        }),
        avatar: image,
        status: Number(values.status),
        role: Number(values.role),
      });
      toast.success("Update information successfully!", {
        pauseOnHover: false,
      });
      navigate("/manage/user");
    } catch (error) {
      toast.error("Failed to update user");
    }
  };
  async function deleteAvatar() {
    const colRef = doc(db, "users", userId);
    await updateDoc(colRef, {
      avatar: "",
    });
  }
  if (!userId) return null;

  return (
    <div>
      <DashboardHeading title="Update user information"></DashboardHeading>
      <form autoComplete="off" onSubmit={handleSubmit(handleUpdateUser)}>
        <div className="w-[200px] h-[200px] mx-auto mb-10">
          <ImageUpload
            className="!rounded-full h-full"
            onChange={handleSelectImage}
            progress={progress}
            image={image}
            handleDeleteImage={handleDeleteImage}
          ></ImageUpload>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Id</Label>
            <input
              type="text"
              value={userId}
              className=" w-full p-[15px] bg-gray-300 rounded-lg"
              readOnly
            />
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Fullname</Label>
            <Input
              name="fullname"
              placeholder="Enter your fullname"
              control={control}
            ></Input>
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              name="username"
              placeholder="Enter your username"
              control={control}
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              placeholder="Enter your email"
              control={control}
              type="email"
            ></Input>
          </Field>
          <Field>
            <Label>Password</Label>
            <InputPasswordToggle control={control}></InputPasswordToggle>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.ACTIVE}
                value={userStatus.ACTIVE}
              >
                Active
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.BANNED}
                value={userStatus.BANNED}
              >
                Banned
              </Radio>
            </FieldCheckboxes>
          </Field>
          <Field>
            <Label>Role</Label>
            <FieldCheckboxes>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.ADMIN}
                value={userRole.ADMIN}
              >
                Admin
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.MOD}
                value={userRole.MOD}
              >
                Moderator
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.USER}
                value={userRole.USER}
              >
                User
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Description</Label>
            <TextArea control={control} name="description"></TextArea>
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

export default UserUpdate;
