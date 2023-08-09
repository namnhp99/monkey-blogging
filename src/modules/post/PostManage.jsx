import React from "react";
import PostTable from "./PostTable";
import DashboardHeading from "modules/dashboard/DashboardHeading";
import { useState } from "react";
import { useEffect } from "react";
import { ITEM_PER_PAGE, userRole } from "utils/constants";
import { debounce } from "lodash";
import { db } from "firebase-app/firebase-config";
import { Button } from "components/button";
import {
  query,
  onSnapshot,
  limit,
  getDocs,
  collection,
  startAfter,
  where,
} from "firebase/firestore";
import { useAuth } from "contexts/auth-context";

const PostManage = () => {
  const [postList, setPostList] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [lastDoc, setLastDoc] = useState();
  const [postSize, setPostSize] = useState(0);
  const { userInfo } = useAuth();
  useEffect(() => {
    document.title = "Post";
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const colRef = collection(db, "posts");
      const q = inputSearch
        ? query(
            colRef,
            where("title", ">=", inputSearch),
            where("title", "<=", inputSearch + "utf8")
          )
        : query(colRef, limit(ITEM_PER_PAGE));
      const documentSnapshots = await getDocs(q);
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastDoc(lastVisible);
      onSnapshot(q, (snapshot) => {
        const results = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        setPostList(results);
      });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputSearch]);
  useEffect(() => {
    const colRef = collection(db, "posts");
    onSnapshot(colRef, (snapshot) => {
      setPostSize(snapshot.size);
    });
  }, []);
  const handleInputSearch = debounce(async (e) => {
    setInputSearch(e.target.value);
  }, 500);
  const handleLoadMorePosts = async () => {
    const q = query(
      collection(db, "posts"),
      limit(ITEM_PER_PAGE),
      startAfter(lastDoc)
    );
    const documentSnapshots = await getDocs(q);
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible);
    onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setPostList([...postList, ...results]);
    });
  };
  if (userInfo?.role === userRole.USER) return null;
  return (
    <div>
      <DashboardHeading title="All posts"></DashboardHeading>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Type here to search post..."
          className="p-4 border border-gray-300 rounded-lg w-[300px]"
          onChange={handleInputSearch}
        />
        <Button kind="primary" height="60px" to="/manage/add-post">
          Create new post
        </Button>
      </div>
      <PostTable postData={postList}></PostTable>
      {postList.length > 0 && postList.length < postSize && (
        <Button
          kind="primary"
          className="mx-auto mt-5"
          onClick={handleLoadMorePosts}
        >
          Load more
        </Button>
      )}
    </div>
  );
};

export default PostManage;
