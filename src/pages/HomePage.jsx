import RootLayout from "components/layout/RootLayout";
import { Search } from "components/search";
import HomeBanner from "modules/home/HomeBanner";
import HomeFeature from "modules/home/HomeFeature";
import HomeNewest from "modules/home/HomeNewest";
import React, { useEffect } from "react";

const HomePage = () => {
  useEffect(() => {
    document.title = "Monkey Blogging App";
  }, []);
  return (
    <RootLayout>
      <HomeBanner></HomeBanner>
      <Search></Search>
      <HomeFeature></HomeFeature>
      <HomeNewest></HomeNewest>
    </RootLayout>
  );
};

export default HomePage;
