import { Button } from "components/button";
import { Radio } from "components/checkbox";
import { Dropdown } from "components/dropdown";
import { Field, FieldCheckboxes } from "components/field";
import { Input } from "components/input";
import { Label } from "components/label";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { imgbbAPI, postStatus, userRole } from "utils/constants";
import ImageUpload from "components/image/ImageUpload";
import useFirebaseImage from "hooks/useFirebaseImage";
import Toggle from "components/toggle/Toggle";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "firebase-app/firebase-config";
import Select from "components/dropdown/Select";
import List from "components/dropdown/List";
import { useAuth } from "contexts/auth-context";
import { toast } from "react-toastify";
import DashboardHeading from "modules/dashboard/DashboardHeading";
import { useNavigate } from "react-router-dom";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUploader from "quill-image-uploader";
import { useMemo } from "react";
import axios from "axios";
Quill.register("modules/imageUploader", ImageUploader);

const PostAddNew = () => {
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState({});
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const {
    control,
    watch,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      status: 2,
      hot: false,
      category: {},
      user: {},
    },
  });
  const {
    image,
    progress,
    handleSelectImage,
    handleDeleteImage,
    handleResetUpload,
  } = useFirebaseImage(getValues, setValue);
  const watchStatus = watch("status");
  const wachHot = watch("hot");
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userInfo.uid) return;
      const colRef = doc(db, "users", userInfo.uid);
      const docData = await getDoc(colRef);
      setValue("user", {
        id: docData.id,
        ...docData.data(),
      });
    };
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.uid]);
  useEffect(() => {
    const colRef = collection(db, "categories");
    const q = query(colRef, where("status", "==", 1));
    onSnapshot(q, (snapshot) => {
      const categories = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setCategories(categories);
    });
  }, []);
  useEffect(() => {
    document.title = "Add new post";
  }, []);
  const handleAddPost = async (values) => {
    if (!isValid) return;
    try {
      const cloneValues = { ...values };
      cloneValues.slug = slugify(values.slug || values.title, {
        lower: true,
        unicode: true,
        trim: true,
      });
      cloneValues.status = Number(values.status);
      const colRef = collection(db, "posts");
      await addDoc(colRef, {
        ...cloneValues,
        image,
        createdAt: serverTimestamp(),
        content,
      });
      toast.success("Create new post successfully!", {
        pauseOnHover: false,
      });
      reset({
        title: "",
        slug: "",
        status: 2,
        hot: false,
        category: {},
        user: {},
      });
      handleResetUpload();
      setSelectCategory({});
      navigate("/manage/posts");
    } catch (error) {
      toast.error("Failed to create new post", {
        pauseOnHover: false,
      });
    }
  };
  const handleClickOption = async (category) => {
    const colRef = doc(db, "categories", category.id);
    const docData = await getDoc(colRef);
    setValue("category", {
      id: docData.id,
      ...docData.data(),
    });
    setSelectCategory(category);
  };
  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["link", "image"],
      ],
      imageUploader: {
        upload: async (file) => {
          const bodyFormData = new FormData();
          bodyFormData.append("image", file);
          const response = await axios({
            method: "POST",
            url: imgbbAPI,
            data: bodyFormData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          return response?.data?.data?.url;
        },
      },
    }),
    []
  );
  if (userInfo?.role === userRole.USER) return null;

  return (
    <>
      <DashboardHeading title="Add a new post"></DashboardHeading>
      <form onSubmit={handleSubmit(handleAddPost)}>
        <div className="form-layout">
          <Field className="!mb-0">
            <Label>Title</Label>
            <Input
              control={control}
              placeholder="Enter your title"
              name="title"
              required
            ></Input>
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              control={control}
              placeholder="Enter your slug"
              name="slug"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Image</Label>
            <ImageUpload
              onChange={handleSelectImage}
              progress={progress}
              image={image}
              handleDeleteImage={handleDeleteImage}
              className="h-[250px]"
            ></ImageUpload>
          </Field>
          <Field>
            <Label>Category</Label>
            <Dropdown>
              <Select placeholder="Select a category"></Select>
              <List>
                {categories.length > 0 &&
                  categories.map((category) => (
                    <Dropdown.Option
                      key={category.id}
                      onClick={() => handleClickOption(category)}
                    >
                      {category.name}
                    </Dropdown.Option>
                  ))}
              </List>
            </Dropdown>
            {selectCategory?.name && (
              <span className="inline-block p-3 text-sm font-semibold text-green-500 bg-green-100 rounded-lg">
                {selectCategory.name}
              </span>
            )}
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Feature Post ?</Label>
            <Toggle
              on={wachHot === true}
              onClick={() => setValue("hot", !wachHot)}
            ></Toggle>
          </Field>
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.APPROVED}
                value={postStatus.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.PENDING}
                value={postStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.REJECTED}
                value={postStatus.REJECTED}
              >
                Reject
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <div className="mb-10">
          <Field>
            <Label>Content</Label>
            <div className="w-full entry-content">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
              />
            </div>
          </Field>
        </div>
        <Button
          type="submit"
          className="mx-auto w-full max-w-[250px]"
          kind="primary"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Add
        </Button>
      </form>
    </>
  );
};

export default PostAddNew;
