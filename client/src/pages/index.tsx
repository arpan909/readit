import Head from "next/head";
import { Fragment } from "react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PostCard from "../components/postCard";
import useSWR from "swr";

dayjs.extend(relativeTime);

export default function Home() {
  const { data: posts } = useSWR("/posts");

  return (
    <Fragment>
      <Head>
        <title>Home</title>
      </Head>
      <div className="container flex pt-4">
        {/* Posts */}
        <div className="w-160">
          {posts?.map((post) => (
            <PostCard post={post} key={post.identifier}></PostCard>
          ))}
        </div>
      </div>
    </Fragment>
  );
}
