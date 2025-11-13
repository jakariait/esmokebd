import React from "react";

const YouTubeEmbed = ({ videoId }) => {
  return (
    <div className="w-full sm:w-auto mx-auto">
      <div className="aspect-video sm:aspect-auto">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full sm:w-[560px] sm:h-[315px] rounded-xl shadow-lg border border-gray-700"
        />
      </div>
    </div>
  );
};

export default YouTubeEmbed;
