import { Button } from "components/button";
import { Radio } from "components/checkbox";
import { Dropdown } from "components/dropdown";
import { Field, FieldCheckboxes } from "components/field";
import ImageUpload from "components/image/ImageUpload";
import { Input } from "components/input";
import { Label } from "components/label";
import Toggle from "components/toggle/Toggle";
import { db } from "firebase-app/firebase-config";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import useFirebaseImage from "hooks/useFirebaseImage";
import DashboardHeading from "modules/dashboard/DashboardHeading";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { imgbbAPI, postStatus } from "utils/constants";
import ImageUploader from "quill-image-uploader";
import axios from "axios";
import slugify from "slugify";
Quill.register("modules/imageUploader", ImageUploader);

const PostUpdate = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const postId = params.get("id");
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState({});
  const [content, setContent] = useState("");
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
    setValue,
    watch,
    reset,
    getValues,
  } = useForm({
    mode: "onChange",
  });
  const imageUrl = getValues("image");
  const imageName = getValues("imageName");
  const { image, progress, handleSelectImage, handleDeleteImage, setImage } =
    useFirebaseImage(getValues, setValue, imageName, deletePostImage);
  const wachHot = watch("hot");
  const watchStatus = watch("status");
  async function deletePostImage() {
    const colRef = doc(db, "users", postId);
    await updateDoc(colRef, {
      image: "",
    });
  }
  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl, setImage]);
  useEffect(() => {
    document.title = "Update post";
  }, []);
  useEffect(() => {
    const getPostData = async () => {
      if (!postId) return;
      const docRef = doc(db, "posts", postId);
      const docData = await getDoc(docRef);
      if (docData.data()) {
        reset(docData.data());
        setContent(docData.data()?.content || "");
        setSelectCategory(docData.data()?.category);
      }
    };
    getPostData();
  }, [postId, reset]);
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
  const handleClickOption = async (category) => {
    const colRef = doc(db, "categories", category.id);
    const docData = await getDoc(colRef);
    setValue("category", {
      id: docData.id,
      ...docData.data(),
    });
    setSelectCategory(category);
  };
  const handleUpdate = async (values) => {
    if (!isValid) return;
    try {
      const docRef = doc(db, "posts", postId);
      values.status = Number(values.status);
      values.slug = slugify(values.slug || values.title, {
        lower: true,
        unicode: true,
        trim: true,
      });
      await updateDoc(docRef, {
        ...values,
        image,
        content,
      });
      toast.success("Update post successfully!");
      navigate("/manage/posts");
    } catch (error) {
      toast.error("Update post failed!");
      console.log(error);
    }
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
  if (!postId) return null;
  return (
    <>
      <DashboardHeading title="Update post"></DashboardHeading>
      <form onSubmit={handleSubmit(handleUpdate)} autoComplete="off">
        <div className="form-layout">
          <Field>
            <Label>Id</Label>
            <input
              type="text"
              value={postId}
              className=" w-full p-[15px] bg-gray-300 rounded-lg"
              readOnly
            />
          </Field>
        </div>
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
              <Dropdown.Select placeholder="Select a category"></Dropdown.Select>
              <Dropdown.List>
                {categories.length > 0 &&
                  categories.map((category) => (
                    <Dropdown.Option
                      key={category.id}
                      onClick={() => handleClickOption(category)}
                    >
                      {category.name}
                    </Dropdown.Option>
                  ))}
              </Dropdown.List>
            </Dropdown>
            {selectCategory?.name && (
              <span className="inline-block p-3 text-sm font-semibold rounded-lg bg-green-100 text-green-500">
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
          Update
        </Button>
      </form>
    </>
  );
};

export default PostUpdate;
