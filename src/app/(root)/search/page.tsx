"use client";

import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import Postbox from "@/components/Postbox"
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { Search as LucideSearch, FileSearch, Loader2 } from "lucide-react";
import SearchSkeleton from "@/components/skeletons/SearchSkeleton";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");

  const posts = useQuery(api.post.getAllPosts);

  const { deboncedValue } = useDebounce(searchTerm, 1000)

  const searchedPosts = useQuery(api.post.search, { searchTerm: deboncedValue });

  const isSearching = searchTerm !== deboncedValue && searchTerm.trim() !== "";
  const displayPosts = deboncedValue ? searchedPosts : posts;
  const showNoResults = deboncedValue && searchedPosts?.length === 0;

  if (!posts) {
    return <SearchSkeleton />;
  }

  return (
    <section className="pt-3 pb-20 max-w-5xl mx-auto px-4">
      <div className="flex justify-start mb-6">
        <h2 className="font-bold text-2xl md:text-3xl">Search For Posts</h2>
      </div>

      <div className="relative max-w-md mb-6">
        <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
        )}
      </div>

      {showNoResults ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FileSearch className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No posts found</h3>
          <p className="text-gray-500 text-center max-w-md">
            We couldn't find any posts matching "{deboncedValue}". Try different keywords.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayPosts?.map(post => <Postbox key={post._id} post={post} />)}
        </div>
      )}
    </section>
  )
}

export default Search;