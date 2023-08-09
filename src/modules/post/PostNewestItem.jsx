import React from "react";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";

const PostNewestItem = ({ data }) => {
  const { user } = data;
  const date = data?.createdAt?.seconds
    ? new Date(data.createdAt?.seconds * 1000)
    : new Date();
  const formatDate = date.toLocaleDateString("vi-VI");
  if (!data.id) return null;
  return (
    <div className="flex items-center gap-5 mb-[28px] pb-[28px] border-b border-b-[#ddd] last:pb-0 last:mb-0 last:border-b-0 max-lg:mb-[14px] max-lg:pb-[14px] ">
      <div className="overflow-hidden rounded-2xl">
        <PostImage
          to={data?.slug}
          url={data?.image}
          alt={data.title}
          className="flex-shrink-0 w-[180px] h-[130px] rounded-xl max-lg:w-[140px] max-lg:h-[100px] hover:scale-110 transition-all duration-500"
        ></PostImage>
      </div>
      <div className="flex-1 post-content">
        <PostCategory to={data?.category?.slug} className="mb-[10px]">
          {data?.category?.name}
        </PostCategory>
        <PostTitle to={data?.slug} className="mb-[10px]">
          {data?.title}
        </PostTitle>
        <PostMeta
          to={user?.username}
          type="secondary"
          authorName={user?.fullname}
          date={formatDate}
        ></PostMeta>
      </div>
    </div>
  );
};

export default PostNewestItem;
