import Heading from "components/layout/Heading";
import RootLayout from "components/layout/RootLayout";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import PostItem from "modules/post/PostItem";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { postStatus } from "utils/constants";

const AuthorPage = () => {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [authorInfo, setAuthorInfo] = useState({});
  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("user.username", "==", slug),
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
  }, [slug]);
  useEffect(() => {
    const q = query(collection(db, "users"), where("username", "==", slug));
    onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        doc.data() && setAuthorInfo(doc.data());
      });
    });
  }, [slug]);
  if (posts.length === 0) return null;
  return (
    <RootLayout>
      <div className="container !pt-10">
        <Heading>
          Author:{" "}
          <span className="italic text-gray-500 font-light">
            {authorInfo?.fullname}
          </span>{" "}
        </Heading>
        <div className="grid-layout grid-layout--primary">
          {posts.length > 0 &&
            posts.map((post) => (
              <PostItem key={post.id} data={post}></PostItem>
            ))}
        </div>
      </div>
    </RootLayout>
  );
};

export default AuthorPage;
