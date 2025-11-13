import React, { useEffect, useState } from "react";
import { CircularProgress, Skeleton, Typography } from "@mui/material";
import axios from "axios";

const PublicContentViewer = ({ title, endpoint }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`${apiUrl}/pagecontent/${endpoint}`);
        if (res.data?.content) {
          setContent(res.data.content);
        }
      } catch (err) {
        console.error("Error fetching content:", err);
        setContent("<p>Sorry, failed to load content.</p>");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [apiUrl, endpoint]);

  if (loading)
    return (
      <div className="xl:container xl:mx-auto p-4 pt-10">
        {Array.from({ length: 15 }).map((_, index) => (
          <Skeleton key={index} variant="text" width="100%" height={30} />
        ))}
      </div>
    );

  return (
    <div className="xl:container xl:mx-auto p-4">
      <div className="text-center py-6 md:py-10 flex flex-col items-center justify-center">
        <Typography
          variant="h4"
          className="text-3xl md:text-5xl font-bold primaryTextColor"
          gutterBottom
        >
          {title}
        </Typography>
        <div className="h-0.5 w-20 secondaryBgColor mx-auto rounded-full shadow-md"></div>
      </div>

      <div
        className="prose max-w-none rendered-html"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default PublicContentViewer;
