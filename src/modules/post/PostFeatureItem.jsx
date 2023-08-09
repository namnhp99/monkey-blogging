import React from "react";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
import PostCategory from "./PostCategory";
import { Link } from "react-router-dom";

const PostFeatureItem = ({ postData }) => {
  if (!postData) return null;
  const { category, user } = postData;
  const date = postData?.createdAt?.seconds
    ? new Date(postData.createdAt?.seconds * 1000)
    : new Date();
  const formatDate = date.toLocaleDateString("vi-VI");
  return (
    <Link to={`/${postData.slug}`} className=" group">
      <div className="w-full rounded-2xl relative h-[169px] lg:h-[272px] cursor-pointer overflow-hidden">
        <PostImage
          url={postData.image}
          alt={postData.title}
          className="h-full transition-all duration-500 group-hover:scale-110"
        ></PostImage>
        <div className="absolute inset-0 bg-black bg-opacity-75 post-overlay rounded-2xl mix-blend-multiply opacity-60"></div>
        <div className="post-content absolute inset-0 z-10 p-5 text-white max-lg:p-[15px]">
          <div className="flex items-center justify-between mb-4 post-top">
            {category?.name && (
              <PostCategory to={category.slug}>{category.name}</PostCategory>
            )}
            <PostMeta
              to={user?.username}
              authorName={user?.fullname}
              date={formatDate}
            ></PostMeta>
          </div>
          <PostTitle size="big" to={postData.slug}>
            {postData.title}
          </PostTitle>
        </div>
      </div>
    </Link>
  );
};

export default PostFeatureItem;
