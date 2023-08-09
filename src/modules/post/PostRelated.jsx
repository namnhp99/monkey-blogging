import Heading from "components/layout/Heading";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import PostItem from "./PostItem";
import { postStatus } from "utils/constants";

const PostRelated = ({ categoryId = "" }) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("category.id", "==", categoryId),
      where("status", "==", postStatus.APPROVED)
    );
    onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setPosts(results);
    });
  }, [categoryId]);
  if (!categoryId || posts.length === 0) return null;
  return (
    <div className="post-related">
      <Heading>Related posts</Heading>
      <div className="grid-layout grid-layout--primary">
        {posts.length > 0 &&
          posts.map((post) => <PostItem key={post.id} data={post}></PostItem>)}
      </div>
    </div>
  );
};

export default PostRelated;
