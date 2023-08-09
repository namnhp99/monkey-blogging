import { ActionDelete, ActionEdit } from "components/action";
import { LabelStatus } from "components/label";
import { Table } from "components/table";
import { db } from "firebase-app/firebase-config";
import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { userRole, userStatus } from "utils/constants";

const UserTable = ({ userData }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Fullname</th>
          <th>Username</th>
          <th>Avatar</th>
          <th>Email</th>
          <th>Date Created</th>
          <th>Status</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {userData.length > 0 &&
          userData.map((user) => (
            <UserItem key={user.id} user={user}></UserItem>
          ))}
      </tbody>
    </Table>
  );
};
const renderStatus = (status) => {
  switch (status) {
    case userStatus.ACTIVE:
      return <LabelStatus type="success">Active</LabelStatus>;
    case userStatus.BANNED:
      return <LabelStatus type="danger">Banned</LabelStatus>;
    default:
      break;
  }
};
const renderRole = (role) => {
  switch (role) {
    case userRole.ADMIN:
      return "Admin";
    case userRole.MOD:
      return "Moderator";
    case userRole.USER:
      return "User";

    default:
      break;
  }
};
const handleDeleteUser = async (user) => {
  const colRef = doc(db, "users", user.id);
  Swal.fire({
    title: "Are you sure to delete this user?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await deleteDoc(colRef);
      Swal.fire("Deleted successfully!", "", "success");
    }
  });
};
const UserItem = ({ user }) => {
  const navigate = useNavigate();
  return (
    <tr>
      <td title={user.id}>{user.id.slice(0, 5) + "..."}</td>
      <td>{user?.fullname}</td>
      <td>{user?.username}</td>
      <td>
        <img
          src={user?.avatar}
          alt="avatar"
          className="w-[60px] h-[60px] object-cover rounded-md"
        />
      </td>
      <td>{user?.email}</td>
      <td>
        {new Date(user?.createdAt?.seconds * 1000).toLocaleDateString("vi-VI")}
      </td>
      <td>{renderStatus(Number(user?.status))}</td>
      <td>{renderRole(Number(user?.role))}</td>
      <td>
        <div className="flex items-center gap-x-3">
          <ActionEdit
            onClick={() => navigate(`/manage/update-user?id=${user.id}`)}
          ></ActionEdit>
          <ActionDelete onClick={() => handleDeleteUser(user)}></ActionDelete>
        </div>
      </td>
    </tr>
  );
};

export default UserTable;
