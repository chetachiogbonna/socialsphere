"use client";

import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import Postbox from "@/components/Postbox"
import { Input } from "@/components/ui/input";
import { Suspense, useState } from "react";
import useDebounce from "@/hooks/useDebounce";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");

  const posts = useQuery(api.post.getAllPosts);

  const { deboncedValue } = useDebounce(searchTerm, 1000)

  const searchedPosts = useQuery(api.post.search, { searchTerm: deboncedValue });

  return (
    <>
      <div className="px-2 pb-8">
        <h1>Search for posts</h1>
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for posts"
          className="w-full mt-4"
        />
      </div>

      <section className="flex justify-center items-center pb-20 px-2">
        <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mx-auto">
          {(deboncedValue ? searchedPosts : posts)?.map(post => <Postbox key={post._id} post={post} />)}
        </div>
      </section>
    </>
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