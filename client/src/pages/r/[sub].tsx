import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import PostCard from "../../components/postCard";

export default function Sub() {
  const router = useRouter();
  const subName = router.query.sub;
  const { data: sub, error } = useSWR(subName ? `/subs/${subName}` : null);

  if (error) {
    router.push("/");
  }

  let postMarkup;
  if (!sub) {
    postMarkup = <p className="text-lg text-center">Loading...</p>;
  } else if (sub.posts.length === 0) {
    postMarkup = (
      <p className="text-lg text-center">No Posts submitted yet 😢</p>
    );
  } else {
    postMarkup = sub.posts.map((post) => (
      <PostCard key={post.identifier} post={post} />
    ));
  }

  return (
    <div className="container flex pt-5">
      {sub && <div className="w-160">{postMarkup}</div>}
    </div>
  );
}
