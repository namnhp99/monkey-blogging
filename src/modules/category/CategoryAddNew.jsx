import { Button } from "components/button";
import { Radio } from "components/checkbox";
import { Field, FieldCheckboxes } from "components/field";
import { Input } from "components/input";
import { Label } from "components/label";
import { useAuth } from "contexts/auth-context";
import { db } from "firebase-app/firebase-config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import DashboardHeading from "modules/dashboard/DashboardHeading";
import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";
import { categoryStatus, userRole } from "utils/constants";

const CategoryAddNew = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      status: 1,
      createdAt: new Date(),
    },
  });
  const watchStatus = watch("status");
  useEffect(() => {
    document.title = "Add Category";
  }, []);
  const handleAddCategory = async (values) => {
    if (!isValid) return;
    const newValues = { ...values };
    newValues.slug = slugify(newValues.slug || newValues.name, { lower: true });
    newValues.status = Number(newValues.status);
    const colRel = collection(db, "categories");
    try {
      await addDoc(colRel, {
        ...newValues,
        createdAt: serverTimestamp(),
      });
      toast.success("Create new category successfully");
      navigate("/manage/category");
    } catch (error) {
      toast.error(error.message);
    } finally {
      reset({
        name: "",
        slug: "",
        status: 1,
        createdAt: new Date(),
      });
    }
  };
  if (userInfo?.role === userRole.USER) return null;
  return (
    <div>
      <DashboardHeading title="Add a new category"></DashboardHeading>
      <form autoComplete="off" onSubmit={handleSubmit(handleAddCategory)}>
        <div className="form-layout">
          <Field>
            <Label>Name</Label>
            <Input
              control={control}
              name="name"
              placeholder="Enter your category name"
            ></Input>
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              control={control}
              name="slug"
              placeholder="Enter your slug"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === categoryStatus.APPROVED}
                value={categoryStatus.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === categoryStatus.UNAPPROVED}
                value={categoryStatus.UNAPPROVED}
              >
                Unapproved
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <Button
          kind="primary"
          className="mx-auto w-[200px]"
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Add new
        </Button>
      </form>
    </div>
  );
};

export default CategoryAddNew;
