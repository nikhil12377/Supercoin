import { Hero } from "@web3uikit/core";
import React, { useState, useEffect } from "react";
import SurveyModal from "../components/Modals/SurveyModal";
import { useRouter } from "next/router";

export default function Earn() {
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const Router = useRouter();

  return (
    <div className="container mx-auto">
      <SurveyModal
        isVisible={showSurveyModal}
        setIsVisible={setShowSurveyModal}
      />
      <h1 className="py-4 px-4 font-bold text-2xl text-center">
        Complete tasks to earn Supercoins!
      </h1>
      <div className="my-2 cursor-pointer">
        <Hero
          backgroundURL="https://moralis.io/wp-content/uploads/2021/06/blue-blob-background-2.svg"
          height="50px"
          linearGradient="linear-gradient(113.54deg, rgba(103, 58, 194, 0.6) 14.91%, rgba(122, 74, 221, 0.498) 25.92%, rgba(209, 103, 255, 0.03) 55.76%), linear-gradient(160.75deg, #7A4ADD 41.37%, #D57BFF 98.29%)"
          textColor="#FFFFFF"
          subTitle="Fill out a survey form."
          onClick={() => {
            setShowSurveyModal(true);
          }}
        />
      </div>
      <div className="my-2 cursor-pointer">
        <Hero
          backgroundURL="https://moralis.io/wp-content/uploads/2021/06/blue-blob-background-2.svg"
          height="50px"
          linearGradient="linear-gradient(113.54deg, rgba(103, 58, 194, 0.6) 14.91%, rgba(122, 74, 221, 0.498) 25.92%, rgba(209, 103, 255, 0.03) 55.76%), linear-gradient(160.75deg, #7A4ADD 41.37%, #D57BFF 98.29%)"
          textColor="#FFFFFF"
          subTitle="Comment on Myntra twitter post."
          onClick={() => {
            Router.push("/twitter");
          }}
        />
      </div>
      <h1 className="py-4 px-4 font-bold text-2xl text-center">
        More coming soon...
      </h1>
    </div>
  );
}
