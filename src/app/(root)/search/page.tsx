"use client";

import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import Postbox from "@/components/Postbox"
import { Suspense, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { Search as SearchIcon } from "lucide-react";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");

  const posts = useQuery(api.post.getAllPosts);

  const { deboncedValue } = useDebounce(searchTerm, 1000)

  const searchedPosts = useQuery(api.post.search, { searchTerm: deboncedValue });

  return (
    <section className="pt-3 pb-20 max-w-5xl mx-auto px-4">
      <div className="flex justify-start">
        <h2 className="font-bold text-2xl md:text-3xl">Search For Posts</h2>
      </div>

      <div className="relative max-w-md mb-6">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      <section className="flex justify-center items-center pb-20 px-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(deboncedValue ? searchedPosts : posts)?.map(post => <Postbox key={post._id} post={post} />)}
        </div>
      </section>
    </section>
  )
}

function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Search />
    </Suspense>
  )
}

export default SearchPage;