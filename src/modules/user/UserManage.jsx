import { Button } from "components/button";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot } from "firebase/firestore";
import DashboardHeading from "modules/dashboard/DashboardHeading";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import UserTable from "./UserTable";
import { useAuth } from "contexts/auth-context";
import { userRole } from "utils/constants";
const UserManage = () => {
  const [userList, setUserList] = useState([]);
  const { userInfo } = useAuth();
  useEffect(() => {
    document.title = "User";
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const colRef = collection(db, "users");
      onSnapshot(colRef, (snapshot) => {
        const result = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        setUserList(result);
      });
    };
    fetchData();
  }, []);
  if (userInfo?.role === userRole.USER) return null;
  return (
    <div>
      <DashboardHeading title="All users"></DashboardHeading>
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Type here to search user..."
          className="p-4 border border-gray-300 rounded-lg w-[300px]"
        />
        <Button kind="primary" height="60px" to="/manage/add-user">
          Create new user
        </Button>
      </div>
      <UserTable userData={userList}></UserTable>
    </div>
  );
};

export default UserManage;
