"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useForm, useFieldArray } from "react-hook-form";
import supabase from "@/libs/supabase/client";
import { useSelector } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { Loader, Plus } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';
import CloudinaryUploader from '@/libs/Cloudinary';

const Page = () => {
  const isDark = useSelector((state) => state.theme.isDarkMode);
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState('');


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control
  } = useForm({
    defaultValues: {
      cardname: "",
      urls: [{ url: "", title: "", tag: "" }]
    }
  });

  const { fields, append } = useFieldArray({
    control,
    name: "urls"
  });

  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingTitle, setLoadingTitle] = useState(null);
  const [loadingTag, setLoadingTag] = useState(null);

  const fetchCards = async () => {
    const { data, error } = await supabase
      .from("url_store")
      .select("*")
      .eq("user_id", user?.id)
      .ilike("title", `%${search}%`)
      .order("created_at", { ascending: false });
    if (!error) setCards(data);
  };

  useEffect(() => {
    if (user) fetchCards();
  }, [user, search]);

  const isUrlValid = (url) => /^https?:\/\//.test(url);

  const handleGenerateTitle = async (index) => {
    const url = watch(`urls.${index}.url`);
    if (!isUrlValid(url)) return;
    setLoadingTitle(index);
    const res = await fetch("https://api.devsdocode.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ddc-free-8e5171eeac9148ed89969cc31002d99d`
      },
      body: JSON.stringify({
        model: "provider-1/gpt-4o",
        messages: [
          { role: "system", content: "Generate a short title (under 20 characters) for this URL. Return only the title." },
          { role: "user", content: url }
        ]
      })
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "";
    setValue(`urls.${index}.title`, reply.trim().slice(0, 30));
    setLoadingTitle(null);
  };

  const handleGenerateTag = async (index) => {
    const url = watch(`urls.${index}.url`);
    if (!isUrlValid(url)) return;
    setLoadingTag(index);
    const res = await fetch("https://api.devsdocode.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ddc-free-8e5171eeac9148ed89969cc31002d99d`
      },
      body: JSON.stringify({
        model: "provider-1/gpt-4o",
        messages: [
          { role: "system", content: "Generate a single hashtag (under 20 characters) for a bookmark card based on this URL. Return only the hashtag like #react-toastify." },
          { role: "user", content: url }
        ]
      })
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "";
    setValue(`urls.${index}.tag`, reply.trim().slice(0, 20));
    setLoadingTag(null);
  };

  const onSubmit = async (data) => {
    const entries = data.urls.map(row => ({
      user_id: user?.id,
      pic: imageUrl,
      card_name: data.cardname,
      title: row.title,
      url: row.url,
      tags: row.tag,
    }));

    const { error } = await supabase.from("url_store").insert(entries);
    if (!error) {
      alert("Card entries added successfully!");
      reset();
      fetchCards();
    } else {
      alert("Failed to submit data");
    }
  };

  const onDelete = async (id) => {
    await supabase.from("url_store").delete().eq("id", id);
    fetchCards();
  };



  const groupedCards = cards.reduce((acc, card) => {
  if (!acc[card.card_name]) acc[card.card_name] = [];
  acc[card.card_name].push(card);
  return acc;
}, {});



  return (
    <>
      <Navbar />
      <div className={`${isDark ? "bg-black text-white" : "bg-white text-black"} min-h-screen`}>
        <div className="flex flex-col justify-center items-center pt-10">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search Title"
              className="px-2 py-1 border rounded"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={`border mt-6 p-4 w-full max-w-2xl ${isDark ? "border-white" : "border-black"}`}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

              <CloudinaryUploader onUpload={(url) => setImageUrl(url)}   previewClassName="rounded-full shadow-sm border border-gray-300 shadow-md mx-auto" />
              {imageUrl && (
                <div className="mt-4">

                  <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                    <p>Image uploaded successfully!</p>
                  </a>
                </div>
              )}

              <input
                type="text"
                placeholder="Enter Card Name"
                {...register("cardname", { required: true })}
                className="px-2 py-1 rounded border"
              />

              {fields.map((field, index) => (
                <div key={field.id} className="border rounded p-4 space-y-2">
                  <input
                    type="text"
                    placeholder="Paste URL"
                    {...register(`urls.${index}.url`, { required: true })}
                    className="w-full px-2 py-1 rounded border"
                  />

                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Generated Title"
                      {...register(`urls.${index}.title`, { required: true })}
                      className="flex-1 px-2 py-1 rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateTitle(index)}
                      disabled={!isUrlValid(watch(`urls.${index}.url`)) || loadingTitle === index}
                      className="text-xs bg-gray-400 text-white px-2 py-1 rounded"
                    >
                      {loadingTitle === index ? <Loader className="animate-spin" size={16} /> : "Generate Title"}
                    </button>
                  </div>

                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Generated Hashtag"
                      {...register(`urls.${index}.tag`)}
                      className="flex-1 px-2 py-1 rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateTag(index)}
                      disabled={!isUrlValid(watch(`urls.${index}.url`)) || loadingTag === index}
                      className="text-xs bg-gray-400 text-white px-2 py-1 rounded"
                    >
                      {loadingTag === index ? <Loader className="animate-spin" size={16} /> : "Generate Tag"}
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => append({ url: "", title: "", tag: "" })}
                className="flex items-center gap-2 text-sm bg-green-600 text-white px-3 py-1 rounded w-fit"
              >
                <Plus size={16} /> Add Another URL
              </button>

              <button
                type="submit"
                className="rounded px-4 py-2 transition bg-blue-600 text-white hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>


{/* mapping of items */}
          <div className="flex flex-col gap-8 mt-10 w-full max-w-4xl mx-auto px-4">
            {Object.entries(groupedCards).map(([cardName, cardGroup]) => (
              <div key={cardName} className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">{cardName}</h2>

                <div className="grid sm:grid-cols-2 gap-6">
                  {cardGroup.map((card) => (
                    <div
                      key={card.id}
                      className="bg-gray-50 border rounded-lg p-4 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-center gap-4">
                        {card.pic && (
                          <Image
                            src={card.pic}
                            alt="Preview"
                            width={80}
                            height={80}
                            className="rounded-full shadow-sm border border-gray-300"
                          />
                        )}
                        <h3 className="text-lg font-semibold text-gray-700">{card.title}</h3>
                      </div>

                      <Link
                        href={card.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline break-all"
                      >
                        View URL
                      </Link>

                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                          {card.tags}
                        </span>
                        <button
                          onClick={() => onDelete(card.id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default Page;

