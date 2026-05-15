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

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch(
          "https://image-generator-backend-f0m2.onrender.com/api/v1/stability",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: form.prompt }),
          },
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        setForm({ ...form, photo: data.photo });
      } catch (err) {
        alert(err.message);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please enter a prompt");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch(
          "https://image-generator-backend-f0m2.onrender.com/api/v1/post",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          },
        );
        await response.json();
        navigate("/");
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please generate an image first");
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
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img src={preview} alt="preview" className="w-9/12 opacity-40" />
            )}
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
          className="mt-10 bg-[#6469ff] text-white px-5 py-2.5 rounded-md block"
        >
          {loading ? "Sharing..." : "Share with the Community"}
        </button>
      </form>
    </section>
  );
};

export default CreatePost;
