import Link from "next/link";
import { Fragment } from "react";

import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import axios from "axios";

import classNames from "classnames";
import { useAuthState } from "../context/auth";
import { useRouter } from "next/router";

dayjs.extend(relativeTime);
export default function PostCard({
  post: {
    identifier,
    voteScore,
    subName,
    userName,
    url,
    createdAt,
    title,
    body,
    commentCount,
    slug,
    userVote,
  },
}) {
  const { authentication } = useAuthState();
  const router = useRouter();
  const vote = async (value) => {
    try {
      const res = await axios.post("/misc/vote", { identifier, slug, value });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div key={identifier} className="flex mb-4 bg-white rounded">
      {/* Vote Section */}
      <div className="w-10 p-2 text-center bg-gray-200 rounded-l">
        <div
          className={classNames(
            "w-6 mt-4 text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500",
            {
              "text-red-500 bg-gray-300": userVote === 1,
            }
          )}
          onClick={authentication ? () => vote(1) : () => router.push("/login")}
        >
          <i className="fas fa-angle-up"></i>
        </div>
        <p className="font-bold text-gray-600">{voteScore}</p>
        <div
          className={classNames(
            "w-6 text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600",
            { "text-blue-600 bg-gray-300": userVote === -1 }
          )}
          onClick={
            authentication ? () => vote(-1) : () => router.push("/login")
          }
        >
          <i className="fas fa-angle-down"></i>
        </div>
      </div>

      {/* Post Data Section */}
      <div className="w-full p-2">
        <div className="flex item-center">
          <Link href={authentication ? `r/${subName}` : `/login`}>
            <img
              src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              className="w-6 h-6 mr-1 rounded-full cursor-pointer"
            />
          </Link>
          <Link href={authentication ? `r/${subName}` : `/login`}>
            <a className="text-xs font-bold cursor-pointer hover:underline">
              r/{subName}
            </a>
          </Link>

          <p className="text-xs text-gray-500">
            <span className="mx-1">•</span> Posted By
            <Link href={authentication ? `/u/${userName}` : `/login`}>
              <a className="mx-1 hover:underline">u/{userName}</a>
            </Link>
            <Link href={authentication ? url : "/login"}>
              <a className="mx-1 hover:underline">
                {dayjs(createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        <Link href={authentication ? url : "/login"}>
          <a className="my-1 text-lg font-semibold ">{title}</a>
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}
        <div className="flex">
          <Link href={authentication ? url : "/login"}>
            <a>
              <div className="px-1 py-1 mr-1 text-xs text-gray-500 transition rounded cursor-pointer hover:bg-gray-200">
                <i className="mr-1 fas fa-comment"></i>
                <span className="font-bold">{commentCount} Comments</span>
              </div>
            </a>
          </Link>
          <div className="px-1 py-1 mr-1 text-xs text-gray-500 transition rounded cursor-pointer hover:bg-gray-200">
            <i className="mr-1 fas fa-share"></i>
            <span className="font-bold">Share</span>
          </div>
          <div className="px-1 py-1 mr-1 text-xs text-gray-500 transition rounded cursor-pointer hover:bg-gray-200">
            <i className="mr-1 fas fa-bookmark"></i>
            <span className="font-bold">Save</span>
          </div>
        </div>
      </div>
    </div>
  );
}
