import { ActionDelete, ActionEdit, ActionView } from "components/action";
import { LabelStatus } from "components/label";
import { Table } from "components/table";
import { db } from "firebase-app/firebase-config";
import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { postStatus } from "utils/constants";

const PostTable = ({ postData }) => {
  const navigate = useNavigate();
  const handleDeletePost = async (postId) => {
    const docRef = doc(db, "posts", postId);
    Swal.fire({
      title: "Are you sure to delete this post?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(docRef);
        Swal.fire("Deleted successfully!", "", "success");
      }
    });
  };
  const renderStatus = (status) => {
    switch (status) {
      case postStatus.APPROVED:
        return <LabelStatus type="success">Approved</LabelStatus>;
      case postStatus.PENDING:
        return <LabelStatus type="warning">Pending</LabelStatus>;
      case postStatus.REJECTED:
        return <LabelStatus type="danger">Reject</LabelStatus>;
      default:
        break;
    }
  };
  const renderFeature = (hot) => {
    switch (hot) {
      case true:
        return <LabelStatus type="success">True</LabelStatus>;
      case false:
        return <LabelStatus type="danger">False</LabelStatus>;

      default:
        break;
    }
  };

  return (
    <Table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Title</th>
          <th>Thumbnail</th>
          <th>Date Created</th>
          <th>Category</th>
          <th>Author</th>
          <th>Featured?</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {postData.length > 0 &&
          postData.map((post) => {
            const { category, user } = post;
            const date = new Date(post.createdAt?.seconds * 1000);
            const formatDate = date.toLocaleDateString("vi-VI");
            return (
              <tr key={post.id}>
                <td title={post.id}>{post.id?.slice(0, 5) + "..."}</td>
                <td>
                  <h3 className="w-[357px] whitespace-break-spaces">
                    {post.title}
                  </h3>
                </td>
                <td>
                  <img
                    src={post.image}
                    alt="post-thumbnail"
                    className="w-full max-w-[80px] h-[40px] rounded object-cover"
                  />
                </td>
                <td>
                  <time className="text-sm text-gray-500">{formatDate}</time>
                </td>
                <td>
                  <span className="text-gray-500">{category?.name}</span>
                </td>
                <td>
                  <span className="text-gray-500">{user?.fullname}</span>
                </td>
                <td>{renderFeature(Boolean(post.hot))}</td>
                <td>{renderStatus(Number(post.status))}</td>
                <td>
                  <div className="flex items-center gap-x-3">
                    <ActionView
                      onClick={() => navigate(`/${post.slug}`)}
                    ></ActionView>
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-post?id=${post.id}`)
                      }
                    ></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDeletePost(post.id)}
                    ></ActionDelete>
                  </div>
                </td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
};

export default PostTable;
