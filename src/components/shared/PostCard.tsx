import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import { multiFormatDateString } from "@/lib/utils";
import { useState } from "react";
import {
  useCommentPost,
  useGetComments,
  useGetUsers,
} from "@/lib/react-query/queriesAndMutations";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Loader from "./Loader";
import { Separator } from "../ui/separator";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user: currentUser } = useUserContext();
  const [comment, setComment] = useState("");
  const { mutate: commentMutation } = useCommentPost();
  const { user } = useUserContext();
  const [showComment, setShowComment] = useState(1);
  const { data: getComment, isPending: commentLoading } = useGetComments(
    post.$id
  );
  console.log(getComment);

  if (!post.creator) return;

  const commentHandle = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() !== "") {
      // Assuming postId is available in your component's state
      const postId: string | undefined = post?.$id; // Replace with your actual postId variable type
      const userId: string = currentUser.id || ""; // Use an empty string as default if currentUser is undefined

      if (postId) {
        commentMutation({ comment, userId, postId });
        // Clear the comment input after sending
        setComment("");
      }
    }
  };
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const showCommentHandler = () => {
    setShowComment((prevCount) => prevCount + 3);
  };

  return (
    <>
      <div className="post-card">
        <div className="flex-between">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.creator.$id}`} key={post.$id}>
              <img
                src={
                  post?.creator?.imageUrl ||
                  `/assets/icons/profile-placeholder.svg`
                }
                alt="creator"
                className="rounded-full w-12 lg:h-12"
              />
            </Link>
            <div className="flex flex-col ">
              <p className="base-medium lg:body-bold ">{post.creator.name}</p>
              <div className="flex-center gap-2 text-gray-600">
                <p className="subtle-semibold lg:small-regular">
                  {multiFormatDateString(post.$createdAt)}
                </p>
                <p className="subtle-semibold lg:small-regular">
                  {post.location}
                </p>
              </div>
            </div>
          </div>
          <Link
            to={`/update-post/${post.$id} `}
            className={`${user.id !== post.creator.$id && "hidden"}`}
          >
            <img src={"/assets/icons/edit.svg"} alt="edit" width={20} />
          </Link>
        </div>
        <Link to={`/posts/${post.$id}`}>
          <div className="small-medium lg:base-medium py-5">
            <p>{post.caption}</p>
            <ul className="flex gap-1 mt-2">
              {post.tags.map((tag: string) => (
                <li key={tag} className="text-gray-700">
                  #{tag}
                </li>
              ))}
            </ul>
          </div>
          <img
            src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="post image"
            className="post-card_img"
          />
        </Link>

        <PostStats post={post} userId={user.id} />
      </div>
      <Separator className="my-5 lg:w-auto bg-slate-400  " />
      <div className="flex gap-3 mb-4">
        <img
          src={currentUser.imageUrl}
          width={44}
        
          alt="user"
          className="rounded-full h-10"
        />
        <Input
          type="text"
          value={comment}
          onChange={handleCommentChange}
          placeholder="Write a comment"
          className=" bg-gray-200 -mr-12 "
        />
        <div>
          <img
            src="/assets/icons/send-message.png"
            width={25}
            alt="send"
            onClick={commentHandle}
            className="mr-7 mt-2 cursor-pointer "
          />
        </div>
      </div>
      <div className=" mb-7 ">
        {commentLoading ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            <div>
              {!getComment ? (
                <>
                  <h1 className="text-black">No comments</h1>
                </>
              ) : (
                <>
                  {getComment.slice(0, showComment).map((comment) => (
                    <>
                      <div key={comment.$id} className="flex gap-3 mb-5">
                        <img
                          src={comment.user.imageUrl}
                          alt={comment.user.name}
                          width={48}
                          style={{ borderRadius: 60, height: "3rem" }}
                        />

                        <div
                          className="bg-slate-200  p-2"
                          style={{ borderRadius: "0.8rem", width: "89%" }}
                        >
                          <div className="flex items-center gap-2">
                            <h3 className="text-[20px] font-medium leading-[100%]">
                              {comment?.user?.name}
                            </h3>
                            <p className="text-zinc-700">
                              {multiFormatDateString(comment.$createdAt)}
                            </p>
                          </div>

                          <h2 className="">{comment.comment}</h2>
                        </div>
                      </div>
                    </>
                  ))}
                  {commentLoading ? (
                    <>
                      <Loader />
                    </>
                  ) : (
                    <>
                      {getComment.length === 0 ? (
                        <h3>no comments</h3>
                      ) : (
                        <>
                          {showComment < getComment.length ? (
                            <h3
                              onClick={showCommentHandler}
                              className="cursor-pointer ml-9"
                            >
                              view more comments
                            </h3>
                          ) : null}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </>
        )}
        <Separator className="my-4 lg:w-auto bg-slate-400"  />
      </div>
    </>
  );
};

export default PostCard;
