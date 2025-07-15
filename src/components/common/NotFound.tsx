import Image from "next/image";
import Link from "next/link";
import React from "react";

interface props {
  data: any;
}
const NotFoundLayout: React.FC<props> = ({ data }) => {
  return (
    <section className="error_page fixed top-0 start-0 end-0 bottom-0">
      <div className="h-full w-full overflow-auto relative flex flex-col flex-nowrap">
        <div className="w-full flex-[0_0_auto] relative z-10">
          <div className="container mx-auto">
            <div
              className="flex flex-row flex-nowrap justify-between items-center"
              style={{ height: "100px" }}
            >
              <div className="flex-auto ml-2">
                <div className="company-logo">
                  <a href="/">
                    <Image
                      width={200}
                      height={100}
                      src={"/assets/images/NameLogo.png"}
                      className="w-[120px] h-[47px] ml-0 sm:justify-center sm:items-center"
                      alt="Rethwrit"
                      title="Rethwrit"
                      loading="lazy"
                      style={{ maxHeight: 60 }}
                    />
                  </a>
                </div>
              </div>
              <div className="w-auto flex-[0_0_auto] text-nowrap flex flex-row flex-nowrap">
                <Link
                  href="/"
                  className="bg-orange-400 text-white inline-flex items-center px-3 md:px-4 py-2 rounded-full mr-1 sm:mr-2"
                >
                  Go Back Home
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="error_body w-full flex-auto relative flex items-center justify-center z-10">
          <div className="block w-full">
            <div className="error_content py-3 pb-0 mx-auto text-center w-full">
              <div className="container mx-auto">
                <h1 className="text-black mb-3 sm:text-4xl text-xl font-semibold text-[calc(1.275rem_+_.3vw)]">
                  {data?.title}
                </h1>
                <h6 className="text-[#212529bf] font-normal text-base">
                  {data?.descriptions},
                  <br />
                  {data?.desbr}.
                </h6>
                <div className="mt-6 flex justify-center">
                  <Image
                    width={300}
                    height={300}
                    src="/assets/images/404-green.png"
                    className="w-[280px] md:w-[350px] h-auto mx-auto"
                    alt="404 Error"
                    title="Rethwrit"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="error_footer w-full flex-[0_0_auto] bg-primary">
          <div className="bg-primary text-white text-center relative z-10 py-4">
            <div className="container mx-auto">
              <div className="flex flex-wrap items-center justify-between">
                <div className="w-full text-center flex-[0_0_auto]">
                  <p className="m-0 lh-sm">
                    © Rethwrit Marketplace Pvt. Ltd. All Rights Reserved.
                    <a
                      className="text-white ml-1"
                      href="https://kodgostar.com"
                      target="_blank"
                    >
                      Digital Partner Kodgostar
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundLayout;
