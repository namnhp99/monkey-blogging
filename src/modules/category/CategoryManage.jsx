import { ActionDelete, ActionEdit, ActionView } from "components/action";
import { Button } from "components/button";
import { LabelStatus } from "components/label";
import { Table } from "components/table";
import { useAuth } from "contexts/auth-context";
import { db } from "firebase-app/firebase-config";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { debounce } from "lodash";
import DashboardHeading from "modules/dashboard/DashboardHeading";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ITEM_PER_PAGE, categoryStatus, userRole } from "utils/constants";

const CategoryManage = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [lastDoc, setLastDoc] = useState();
  const [categorySize, setCategorySize] = useState(0);
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  useEffect(() => {
    document.title = "Category";
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const colRef = collection(db, "categories");
      const q = inputSearch
        ? query(
            colRef,
            where("name", ">=", inputSearch),
            where("name", "<=", inputSearch + "utf8")
          )
        : query(colRef, limit(ITEM_PER_PAGE));
      const documentSnapshots = await getDocs(q);
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastDoc(lastVisible);
      onSnapshot(q, (snapshot) => {
        const result = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        setCategoryList(result);
      });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputSearch]);
  useEffect(() => {
    const colRef = collection(db, "categories");
    onSnapshot(colRef, (snapshot) => {
      setCategorySize(snapshot.size);
    });
  }, []);
  const handleDeleteCategory = (categoryId) => {
    const docRef = doc(db, "categories", categoryId);
    Swal.fire({
      title: "Are you sure to delete this category?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(docRef);
        Swal.fire("Deleted successfully!", "", "success");
      }
    });
  };
  const handleInputSearch = debounce((e) => {
    setInputSearch(e.target.value);
  }, 500);
  const handleLoadMoreCategory = async () => {
    const nextRef = query(
      collection(db, "categories"),
      startAfter(lastDoc),
      limit(4)
    );
    const documentSnapshots = await getDocs(nextRef);
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible);
    onSnapshot(nextRef, (snapshot) => {
      const result = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setCategoryList([...categoryList, ...result]);
    });
  };
  if (userInfo?.role === userRole.USER) return null;
  return (
    <div>
      <DashboardHeading title="All categories"></DashboardHeading>
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Type here to search category..."
          className="p-4 border border-gray-300 rounded-lg w-[300px]"
          onChange={handleInputSearch}
        />
        <Button kind="primary" height="60px" to="/manage/add-category">
          Create new category
        </Button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categoryList.length > 0 &&
            categoryList.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>
                  <span className="italic text-gray-400">{category.slug}</span>
                </td>
                <td>
                  {Number(category.status) === categoryStatus.APPROVED && (
                    <LabelStatus type="success">Approved</LabelStatus>
                  )}
                  {Number(category.status) === categoryStatus.UNAPPROVED && (
                    <LabelStatus type="warning">Unapproved</LabelStatus>
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-x-3">
                    <ActionView></ActionView>
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-category?id=${category.id}`)
                      }
                    ></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDeleteCategory(category.id)}
                    ></ActionDelete>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <div>
        {categorySize > categoryList.length ? (
          <Button
            kind="primary"
            className="mx-auto mt-5"
            onClick={handleLoadMoreCategory}
          >
            Load more
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default CategoryManage;
