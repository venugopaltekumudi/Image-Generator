import React, { useEffect, useState } from "react";
import { Card, FormField, Loader } from "../components";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // POINTING TO LIVE BACKEND
      const response = await fetch(
        "https://image-generator-backend-f0m2.onrender.com/api/v1/post",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.ok) {
        const result = await response.json();
        setAllPosts(result.data.reverse()); // Shows newest posts first
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto p-10">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          The Community Showcase
        </h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">
          Browse through a collection of imaginative and visually stunning
          images
        </p>
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
            {allPosts?.length > 0 ? (
              allPosts.map((post) => <Card key={post._id} {...post} />)
            ) : (
              <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">
                No Posts Found
              </h2>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
