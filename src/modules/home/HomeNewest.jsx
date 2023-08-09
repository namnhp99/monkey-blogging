import Heading from "components/layout/Heading";
import { db } from "firebase-app/firebase-config";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import PostNewestItem from "modules/post/PostNewestItem";
import PostNewestLarge from "modules/post/PostNewestLarge";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const HomeNewest = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const colRef = collection(db, "posts");
    const q = query(
      colRef,
      where("status", "==", 1),
      where("hot", "==", false),
      limit(4)
    );
    onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setPosts(posts || []);
    });
  }, []);
  const [first, ...others] = posts;
  if (posts.length === 0) return null;
  return (
    <div className="container">
      <Heading>Latest posts</Heading>
      <div className="layout grid grid-cols-2 gap-10 mb-10 items-start max-lg:grid-cols-[100%]">
        <PostNewestLarge data={first}></PostNewestLarge>
        <div className="py-[28px] px-5 bg-slate-200 rounded-2xl max-lg:py-[14px] max-lg:px-[10px]">
          {others.length > 0 &&
            others.map((item) => (
              <PostNewestItem key={item.id} data={item}></PostNewestItem>
            ))}
        </div>
      </div>
    </div>
  );
};

export default HomeNewest;
