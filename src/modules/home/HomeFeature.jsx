import Heading from "components/layout/Heading";
import { db } from "firebase-app/firebase-config";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import PostFeatureItem from "modules/post/PostFeatureItem";
import React, { useEffect, useState } from "react";
const HomeFeature = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const colRef = collection(db, "posts");
    const q = query(
      colRef,
      where("status", "==", 1),
      where("hot", "==", true),
      limit(3)
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
  if (posts.length === 0) return null;
  return (
    <div className="container mb-10">
      <Heading>Featured posts</Heading>
      <div className="grid-layout">
        {posts.map((post) => (
          <PostFeatureItem key={post.id} postData={post}></PostFeatureItem>
        ))}
      </div>
    </div>
  );
};

export default HomeFeature;
