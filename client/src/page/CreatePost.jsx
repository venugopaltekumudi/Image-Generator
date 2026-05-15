import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { preview } from "../assets";
import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../components";

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", prompt: "", photo: "" });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayImage, setDisplayImage] = useState(null);

  const generateImage = async () => {
    if (!form.prompt.trim()) return alert("Please enter a prompt");

    try {
      setGeneratingImg(true);
      // NOTE: Update this URL to your deployed backend URL later
      const response = await fetch("http://localhost:8080/api/v1/stability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: form.prompt }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // BLOB CONVERSION: Bypasses browser security blocks
      const base64Data = data.photo.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(blob);

      setForm({ ...form, photo: data.photo });
      setDisplayImage(imageUrl);
    } catch (err) {
      alert("Generation failed. See console.");
    } finally {
      setGeneratingImg(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.photo) return alert("Generate an image first");

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/v1/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) navigate("/");
    } catch (err) {
      alert("Sharing failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto p-10">
      <h1 className="font-extrabold text-[32px]">Create</h1>
      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Name"
            type="text"
            name="name"
            placeholder="John"
            value={form.name}
            handleChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="A futuristic city"
            value={form.prompt}
            handleChange={(e) => setForm({ ...form, prompt: e.target.value })}
            isSurpriseMe
            handleSurpriseMe={() =>
              setForm({ ...form, prompt: getRandomPrompt(form.prompt) })
            }
          />

          <div className="relative bg-gray-50 border border-gray-300 rounded-lg w-64 h-64 flex justify-center items-center overflow-hidden">
            <img
              src={displayImage || preview}
              alt="preview"
              className={
                displayImage
                  ? "w-full h-full object-contain"
                  : "w-9/12 opacity-40"
              }
            />
            {generatingImg && (
              <div className="absolute inset-0 z-10 flex justify-center items-center bg-[rgba(0,0,0,0.5)]">
                <Loader />
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={generateImage}
          className="mt-5 bg-green-700 text-white px-5 py-2.5 rounded-md"
        >
          {generatingImg ? "Generating..." : "Generate"}
        </button>
        <button
          type="submit"
          className="mt-10 bg-[#6469ff] text-white px-5 py-2.5 rounded-md block w-full sm:w-auto"
        >
          {loading ? "Sharing..." : "Share Post"}
        </button>
      </form>
    </section>
  );
};

export default CreatePost;
