import { Button } from "components/button";
import React from "react";
const HomeBanner = () => {
  return (
    <section className="container mb-20 banner">
      <div className=" p-10 min-h-[520px] bg-gradient-to-br from-primary to-secondary flex justify-between items-center rounded-lg max-lg:flex-col max-lg:min-h-[unset]">
        <div className="banner-content max-w-[600px] text-white">
          <h1 className="banner-heading text-[48px] font-bold mb-[30px] max-lg:text-[30px] max-lg:mb-[10px]">
            Monkey Blogging
          </h1>
          <p className="banner-desc leading-relaxed mb-[50px] max-lg:text-sm max-lg:mb-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste eum
            exercitationem, reiciendis obcaecati eius sint nihil minus enim quae
            officia itaque pariatur molestiae perspiciatis voluptatum quod,
            praesentium dolore omnis? Necessitatibus.
          </p>
          <Button
            to="/sign-up"
            className="py-4 px-16 hover:bg-[#00b4aa] hover:text-white max-lg:text-sm max-lg:h-auto max-lg:p-[15px]"
            kind="secondary"
          >
            Get Started
          </Button>
        </div>
        <div className="banner-image max-lg:mt-[25px]">
          <img src="/img-banner.png" alt="banner" />
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
