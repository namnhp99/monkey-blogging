import { db } from "firebase-app/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const AuthorBox = ({ userId = "" }) => {
  const [user, setUser] = useState({});
  useEffect(() => {
    const fetchUserData = async () => {
      const docRef = doc(db, "users", userId);
      const docData = await getDoc(docRef);
      docData.data() && setUser(docData.data());
    };
    fetchUserData();
  }, [userId]);
  if (!userId) return null;
  return (
    <div
      className="mt-[60px] flex rounded-[20px] bg-grayf3"
      aria-label="author"
    >
      <div
        className="w-[200px] h-[200px] flex-shrink-0 rounded-[20px]"
        aria-label="author-image"
      >
        <img
          src={user?.avatar}
          alt={user.fullName}
          className="w-full h-full object-cover rounded-[20px]"
        />
      </div>
      <div className="flex-1 p-5" aria-label="author-content">
        <h3 className="font-bold mb-[10px] text-xl" aria-label="author-name">
          {user?.fullname}
        </h3>
        <p className="text-sm leading-loose" aria-label="author-desc">
          {user?.description}
        </p>
      </div>
    </div>
  );
};

export default AuthorBox;
