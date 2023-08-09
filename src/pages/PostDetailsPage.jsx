import RootLayout from "components/layout/RootLayout";
import PostCategory from "modules/post/PostCategory";
import PostMeta from "modules/post/PostMeta";
import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useState } from "react";
import { useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "firebase-app/firebase-config";
import parse from "html-react-parser";
import AuthorBox from "modules/post/AuthorBox";
import PostRelated from "modules/post/PostRelated";
const PostDetailsPageStyles = styled.div`
  padding-bottom: 100px;
  .post {
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 40px;
      margin: 40px 0;
    }
    &-feature {
      width: 100%;
      max-width: 640px;
      height: 466px;
      border-radius: 20px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        flex-shrink: 0;
      }
    }
    &-heading {
      font-weight: bold;
      font-size: 36px;
      margin-bottom: 16px;
    }
    &-info {
      flex: 1;
    }
    &-content {
      max-width: 700px;
      margin: 80px auto;
    }
  }
  @media screen and (max-width: 1023.98px) {
    padding-bottom: 40px;
    .post {
      &-header {
        flex-direction: column;
      }
      &-feature {
        height: auto;
      }
      &-heading {
        font-size: 26px;
      }
      &-content {
        margin: 40px 0;
      }
    }
    .author {
      flex-direction: column;
      &-image {
        width: 100%;
        height: auto;
      }
    }
  }
`;

const PostDetailsPage = () => {
  const { slug } = useParams();
  const [postInfo, setPostInfo] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "posts"), where("slug", "==", slug));
      onSnapshot(q, (snapshot) => {
        snapshot.docs.forEach((doc) => {
          doc.data() && setPostInfo(doc.data());
        });
      });
    };
    fetchData();
  }, [slug]);
  useEffect(() => {
    document.body.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [slug]);
  if (!postInfo.title) return null;
  const { user } = postInfo;
  const date = postInfo.createdAt?.seconds
    ? new Date(postInfo.createdAt?.seconds * 1000)
    : new Date();
  const formatDate = date.toLocaleDateString("vi-VI");
  return (
    <PostDetailsPageStyles>
      <RootLayout>
        <div className="container">
          <div className="post-header">
            <div className="post-feature">
              <img src={postInfo.image} alt="post-img" />
            </div>
            <div className="post-info">
              <PostCategory to={postInfo.category?.slug} className="mb-6">
                {postInfo.category?.name}
              </PostCategory>
              <h1 className="post-heading">{postInfo.title}</h1>
              <PostMeta
                type="secondary"
                to={user?.username}
                authorName={user?.fullname}
                date={formatDate}
              ></PostMeta>
            </div>
          </div>
          <div className="post-content">
            <div className="entry-content">{parse(postInfo.content || "")}</div>
            <AuthorBox userId={user.id}></AuthorBox>
          </div>
          <PostRelated categoryId={postInfo.category?.id}></PostRelated>
        </div>
      </RootLayout>
    </PostDetailsPageStyles>
  );
};

export default PostDetailsPage;
