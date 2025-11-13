import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";

const ImageComponent = ({
  imageName,
  className = "",
  altName,
  skeletonHeight,
}) => {
  const [imageSrc, setImageSrc] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (imageName) {
      const apiUrl = import.meta.env.VITE_API_URL;
      const imageUrl = `${apiUrl.replace("/api", "")}/uploads/${imageName}`;
      setImageSrc(imageUrl);
    }
  }, [imageName]);

  return (
    <div>
      {isLoading && <Skeleton height={skeletonHeight} width={"100%"} />}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={altName}
          className={className}
          style={{ display: isLoading ? "none" : "block" }}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setImageSrc(); // or keep blank
          }}
        />
      )}
    </div>
  );
};

export default ImageComponent;
