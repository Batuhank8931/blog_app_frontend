import { useEffect, useState } from "react";
import {  useLocation } from "react-router-dom";

function Show() {
  const location = useLocation();
  const [post, setPost] = useState(null);

  const postId = location.state?.id;

  async function getPost() {
    const res = await fetch(`/api/posts/${postId}`);
    const data = await res.json();
    
    if (res.ok) {
      setPost(data.post);
    }
  }

  //console.log(post);

  useEffect(() => {
    if (postId) {
      getPost();
    }
  }, [postId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">{post?.title}</h1>
      <div className="grid grid-cols-1 gap-4">
        {post ? (
          <div key={post.id} className="border p-4 rounded shadow-md flex flex-col justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-2">
                <p>Created by {post.user.name} on {new Date(post.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })} at {new Date(post.created_at).toLocaleTimeString()}</p>
              </div>
              <p className="text-gray-700">{post.content}</p>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Show;
