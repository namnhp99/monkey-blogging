import React from "react";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";

const PostNewestLarge = ({ data }) => {
  const { user } = data;
  const date = data?.createdAt?.seconds
    ? new Date(data.createdAt?.seconds * 1000)
    : new Date();
  const formatDate = date.toLocaleDateString("vi-VI");
  if (!data.id) return null;
  return (
    <div>
      <div className="mb-5 overflow-hidden rounded-2xl">
        <PostImage
          to={data?.slug}
          url={data?.image}
          alt={data.title}
          className=" h-[433px] rounded-2xl max-lg:h-[250px] hover:scale-110 duration-500"
        ></PostImage>
      </div>
      <PostCategory to={data?.category?.slug} className="mb-[10px]">
        {data?.category?.name}
      </PostCategory>
      <PostTitle size="big" to={data?.slug} className="mb-5">
        {data?.title}
      </PostTitle>
      <PostMeta
        to={user?.username}
        type="secondary"
        authorName={user?.fullname}
        date={formatDate}
      ></PostMeta>
    </div>
  );
};

export default PostNewestLarge;
