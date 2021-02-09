import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PostCard from "../components/postCard";

dayjs.extend(relativeTime);

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="pt-12">
      <Head>
        <title>Home</title>
      </Head>
      <div className="container flex pt-4">
        {/* Posts */}
        <div className="w-160">
          {posts.map((post) => (
            <PostCard post={post} key={post.identifier}></PostCard>
          ))}
        </div>
      </div>
    </div>
  );
}
