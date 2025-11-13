import React, { useEffect, useState } from "react";
import ImageComponent from "../componentGeneral/ImageComponent.jsx";
import { useSearchParams, useNavigate } from "react-router-dom"; // for SPA routing
import { Link } from "react-router-dom";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const searchParams = new URLSearchParams(window.location.search);
  const navigate = useNavigate();

  useEffect(() => {
    const page = parseInt(searchParams.get("page")) || 1;
    setCurrentPage(page);

    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/activeblog?page=${page}&limit=20`);
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();

        setBlogs(data.data || []);
        setTotalPages(data.totalPages || 1);
        setErrorMsg("");
      } catch (err) {
        setErrorMsg(err.message || "Something went wrong");
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [window.location.search]);

  const handlePageChange = (newPage) => {
    navigate(`?page=${newPage}`);
  };

  if (errorMsg) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <p className="text-red-600 font-semibold">Error: {errorMsg}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <p className="text-gray-600 text-lg">No blogs found.</p>
      </div>
    );
  }

  return (
    <div className="xl:container xl:mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Stay Informed — Read Our Blogs
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="flex flex-col gap-4">
            <Link
              to={`/blogs/${blog.slug}`}
              className="hover:underline text-orange-500"
            >
              <ImageComponent
                imageName={blog.thumbnailImage}
                className="rounded w-full aspect-video object-contain"
              />
            </Link>
            <Link
              to={`/blogs/${blog.slug}`}
              className="hover:underline text-orange-500"
            >
              {blog.name}
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <nav className="flex justify-center items-center space-x-4 mt-10">
        <PaginationButton
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(currentPage - 1)}
          label="Previous"
        />
        <span className="font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <PaginationButton
          disabled={currentPage >= totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          label="Next"
        />
      </nav>
    </div>
  );
};

function PaginationButton({ disabled, onClick, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed ${
        disabled ? "pointer-events-none" : ""
      }`}
    >
      {label}
    </button>
  );
}

export default AllBlogs;
