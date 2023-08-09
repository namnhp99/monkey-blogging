import { Button } from "components/button";
import { Radio } from "components/checkbox";
import { Field, FieldCheckboxes } from "components/field";
import { Input } from "components/input";
import { Label } from "components/label";
import { db } from "firebase-app/firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import DashboardHeading from "modules/dashboard/DashboardHeading";
import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";
import { categoryStatus } from "utils/constants";

const CategoryUpdate = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {},
  });
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const categoryId = params.get("id");
  useEffect(() => {
    document.title = "Update Category";
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const colRef = doc(db, "categories", categoryId);
      const singleDoc = await getDoc(colRef);
      reset(singleDoc.data());
    };
    fetchData();
  }, [categoryId, reset]);
  const watchStatus = watch("status");
  const handleUpdateCategory = async (values) => {
    const colRef = doc(db, "categories", categoryId);
    try {
      await updateDoc(colRef, {
        name: values.name,
        slug: slugify(values.slug || values.name, { lower: true }),
        status: Number(values.status),
      });
      toast.success("Update category successfully!", { pauseOnHover: false });
      navigate("/manage/category");
    } catch (error) {
      toast.error("Failed to update category");
    }
  };
  if (!categoryId) return null;
  return (
    <div>
      <DashboardHeading title="Update category information"></DashboardHeading>
      <form autoComplete="off" onSubmit={handleSubmit(handleUpdateCategory)}>
        <div className="form-layout">
          <Field>
            <Label>Id</Label>
            <input
              type="text"
              value={categoryId}
              className=" w-full p-[15px] bg-gray-300 rounded-lg"
              readOnly
            />
          </Field>
        </div>
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
          Update
        </Button>
      </form>
    </div>
  );
};

export default CategoryUpdate;
