import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { handlePostState, useSSRPostsState } from "../atoms/postAtom";
import Input from "./Input";
import Post from "./Post";

function Feed({ posts }) {
  const [realtimePosts, setRealtimePosts] = useState([]);
  const [handlePost, setHandlePost] = useRecoilState(handlePostState);
  const [useSSRPosts, setUseSSRPosts] = useRecoilState(useSSRPostsState);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      setRealtimePosts(responseData);
      setUseSSRPosts(false);
    };

    fetchPosts();
  }, [handlePost]);

  console.log(realtimePosts);

  return (
    <div className="space-y-6 pb-24 max-w-lg">
      <Input />
      {/* Posts */}
      <div className="space-y-3">
        {/* BONUS -> Add server side rendered posts */}
        {!useSSRPosts
          ? realtimePosts.map((post) => <Post key={post._id} post={post} />)
          : posts.map((post) => <Post key={post._id} post={post} />)}
      </div>
    </div>
  );
}

export default Feed;
