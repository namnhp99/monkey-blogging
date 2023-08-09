import { Button } from "components/button";
import { auth } from "firebase-app/firebase-config";
import { signOut } from "firebase/auth";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

const menuLinks = [
  {
    url: "/",
    title: "Home",
  },
  {
    url: "/blog",
    title: "Blog",
  },
  {
    url: "/contact",
    title: "Contact",
  },
];
const Header = () => {
  // const { userInfo } = useAuth();
  const [user] = useAuthState(auth);
  console.log("🚀 ~ file: Header.jsx:26 ~ Header ~ user:", user);
  return (
    <header className="container mb-10">
      <div className="flex items-center justify-between">
        <HeaderLeft />
        <HeaderRight userInfo={user} />
      </div>
    </header>
  );
};
function HeaderLeft() {
  return (
    <div className="flex items-center gap-x-8">
      <Logo />
      <NavMenu />
    </div>
  );
}
function HeaderRight({ userInfo }) {
  return userInfo ? (
    <Authenticated userInfo={userInfo} />
  ) : (
    <NotAuthenticated />
  );
}
function Logo() {
  return (
    <Link to="/">
      <img
        srcSet="/logo.png 2x"
        alt="monkey-blogging-logo"
        className="logo block max-w-[43px] max-lg:max-w-[30px]"
      />
    </Link>
  );
}
function NotAuthenticated() {
  return (
    <div className="flex items-center gap-5 header-buttons">
      <Button to="/sign-up" kind="header">
        Sign Up
      </Button>
      <Button to="/sign-in" kind="header">
        Sign In
      </Button>
    </div>
  );
}
function Authenticated({ userInfo }) {
  // const getLastName = (fullname) => {
  //   if (userInfo.uid) {
  //     return fullname.split(" ")[0];
  //   }
  // };
  const handleSignOut = async () => {
    await signOut(auth);
  };
  return (
    <div className="flex items-center header-auth gap-x-5">
      <span>
        Welcome,
        <strong className="text-gray-600"> {userInfo?.displayName}</strong>
      </span>
      {userInfo.photoURL ? (
        <div className="w-10 h-10 rounded-full">
          <img
            src={userInfo.photoURL}
            alt="accountImg"
            className="object-cover w-full h-full rounded-full"
          />
        </div>
      ) : null}
      <Button to="/dashboard" kind="header">
        Dashboard
      </Button>
      <Button onClick={handleSignOut} kind="header">
        Sign Out
      </Button>
    </div>
  );
}
function NavMenu() {
  return (
    <nav>
      <ul className="flex items-center gap-x-7 max-lg:hidden">
        {menuLinks.map((item) => (
          <li key={item.title} className="menu-item">
            <NavLink to={item.url} className="text-lg font-medium menu-link">
              {item.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
export default Header;
