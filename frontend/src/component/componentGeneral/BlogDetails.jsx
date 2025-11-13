import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageComponent from "../componentGeneral/ImageComponent.jsx";

const BlogDetails = () => {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${apiUrl}/blog/slug/${slug}`);
        if (!res.ok) throw new Error("Failed to load blog");

        const data = await res.json();
        setBlog(data.data);
      } catch (err) {
        setError(err.message || "Error fetching blog");
      }
    };

    fetchBlog();
  }, [slug, apiUrl]);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="xl:container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">{blog.name}</h1>

      <div className="flex items-center justify-center w-full mb-10 mt-10">
        <ImageComponent imageName={blog.thumbnailImage} />
      </div>

      <div className="flex justify-between items-center">
        <p className="text-gray-600 mb-2">By {blog.author || "Unknown"}</p>
        <p className="text-gray-600 mb-2">
          {new Date(blog.updatedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div
          className="rendered-html col-span-10"
          dangerouslySetInnerHTML={{ __html: blog.longDesc }}
        />
        <div className="flex flex-col gap-2 mt-4 col-span-2">
          <h1 className="text-lg font-semibold">Tags:</h1>
          {blog.searchTags?.map((tag, index) => (
            <span
              key={index}
              className="bg-orange-200 text-gray-800 px-3 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
