import React from "react";
import FeatureStore from "../../store/FeatureStore";
import ImageComponent from "./ImageComponent.jsx";
import Skeleton from "react-loading-skeleton";

const Feature = () => {
  const { FeatureStoreList, FeatureStoreListLoading, FeatureStoreListError } =
    FeatureStore();

  if (FeatureStoreListError) {
    return (
      <div className="primaryTextColor  container md:mx-auto text-center p-3">
        <h1 className={"p-10"}>{FeatureStoreListError}</h1>
      </div>
    ); // Display error message
  }

  if (!FeatureStoreListLoading && FeatureStoreList.length === 0) {
    return null;
  }

  return (
    <div className="xl:container xl:mx-auto pb-6 px-3">
      {FeatureStoreListLoading ? (
        <>
          <div className={"grid grid-cols-2 md:grid-cols-4 gap-6 mb-6"}>
            <Skeleton height={200} width={"100%"} />
            <Skeleton height={200} width={"100%"} />
            <Skeleton height={200} width={"100%"} />
            <Skeleton height={200} width={"100%"} />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FeatureStoreList.map((feature) => (
              <div
                key={feature._id}
                className="bg-white border border-gray-300 rounded-xl shadow-md py-3 flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300"
              >
                {/* Centering the Image */}
                <div className="flex justify-center items-center">
                  <ImageComponent
                    imageName={feature.imgSrc}
                    className="w-16 h-16 object-contain"
                    altName={feature.title}
                  />
                </div>
                {/* Title */}
                <h3 className="mt-6 text-gray-700 text-sm ">
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Feature;
