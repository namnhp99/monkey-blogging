import React from "react";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";

const PostItem = ({ data }) => {
  const date = data?.createdAt?.seconds
    ? new Date(data.createdAt?.seconds * 1000)
    : new Date();
  const formatDate = date.toLocaleDateString("vi-VI");
  if (!data) return null;
  const { user } = data;
  return (
    <div className="flex flex-col items-start">
      <div className="mb-5 overflow-hidden rounded-2xl">
        <PostImage
          url={data?.image}
          alt="thumbnail-post"
          to={data?.slug}
          className="h-[202px]  rounded-2xl max-lg:aspect-video max-lg:h-auto hover:scale-110 transition-all duration-500"
        ></PostImage>
      </div>
      <PostCategory to={data?.category?.slug} className="mb-[10px]">
        {data?.category?.name}
      </PostCategory>
      <PostTitle to={data?.slug} className="mb-5">
        {data?.title}
      </PostTitle>
      <PostMeta
        type="secondary"
        to={user?.username}
        authorName={user?.fullname}
        date={formatDate}
      ></PostMeta>
    </div>
  );
};

export default PostItem;
