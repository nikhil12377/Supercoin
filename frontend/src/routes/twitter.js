import "../styles/Home.module.css";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Avatar, Input, useNotification } from "@web3uikit/core";
import { useRouter } from "next/router";
import apiCalls from "../components/API/apiCalls";
import { userImage, myntraImageURI, Myntra } from "../constants/imageURI";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;

export default function Twitter() {
  const router = useRouter();
  const { id } = router.query;

  const [item, setItem] = useState();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { account } = useMoralis();
  const dispatch = useNotification();
  const handleCommentSuccess = async () => {
    const data = {
      user: account,
      amount: 1,
    };
    setIsLoading(true);
    await apiCalls(`${BACKEND_API}/api/issueTokens`, data);
    setIsLoading(false);
    dispatch({
      type: "success",
      message: "Won 1 Supercoin!",
      title: "Commented",
      position: "topR",
    });
  };

  async function handleFetch() {
    const data = await fetch(`https://fakestoreapi.com/products/${id}`);
    const tempItem = await data.json();
    setItem(tempItem);
  }

  useEffect(() => {
    if (id) {
      handleFetch();
    }
  }, [id]);

  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem("comments", JSON.stringify(comments));
    }
  }, [comments]);

  useEffect(() => {
    if (localStorage.getItem("comments")) {
      setComments(JSON.parse(localStorage.getItem("comments")));
    }
  }, []);

  function TextPrinter({ text }) {
    const words = text.split(" ");
    const lines = [];

    for (let i = 0; i < words.length; i += 8) {
      const line = words.slice(i, i + 8).join(" ");
      lines.push(line);
    }

    return (
      <div>
        {lines.map((line, index) => {
          return <p key={index}>{line}</p>;
        })}
      </div>
    );
  }

  return (
    <div className="twitter-container">
      <div className="flex flex-wrap">
        <div className="grid grid-rows-3 grid-flow-col gap-8">
          <div className="row-span-3 pr-20">
            <div className="grid grid-rows-9 grid-flow-row gap-4">
              <div className="font-bold text-2xl">Home</div>
              <div className="font-bold text-2xl">Explore</div>
              <div className="font-bold text-2xl">Notifications</div>
              <div className="font-bold text-2xl">Messages</div>
              <div className="font-bold text-2xl">Lists</div>
              <div className="font-bold text-2xl">Communities</div>
              <div className="font-bold text-2xl">Verified</div>
              <div className="font-bold text-2xl">Profile</div>
              <div className="font-bold text-2xl">More</div>
            </div>
          </div>
          <div className="row-span-3 pr-20">
            <div className="font-bold text-2xl mb-5">Home</div>
            <div>
              {item ? (
                <div>
                  <div className="mb-3 flex">
                    <Avatar image={userImage} isRounded theme="image" />
                    <span className="font-bold text-lg ml-2">You</span>
                    <span className="text-gray-500 ml-2">@user · just now</span>
                  </div>
                  <div className="mb-4">
                    <p className="mb-2">
                      Bought this for just {item.price}rs! #supercoin
                    </p>
                    <p>{item.title}</p>
                    <Image
                      loader={() => item.image}
                      src={item.image}
                      height="200"
                      width="250"
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              <div className="mb-3">
                <Image
                  loader={() => myntraImageURI}
                  src={myntraImageURI}
                  height="20"
                  width="20"
                />
                <span className="font-bold text-lg ml-2">Myntra</span>
                <span className="text-gray-500 ml-2">@Myntra · 1h</span>
              </div>
              <TextPrinter text={Myntra} />
              <div className="mt-2 grid grid-flow-col">
                <Input
                  value={commentText}
                  name="Test text Input"
                  placeholder="Post your reply!"
                  onChange={(e) => {
                    setCommentText(e.target.value);
                  }}
                />
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  disabled={isLoading}
                  onClick={async () => {
                    await handleCommentSuccess();
                    if (commentText != "") {
                      const tempComment = { txt: commentText };
                      setComments((oldComments) => [
                        ...oldComments,
                        tempComment,
                      ]);
                      setCommentText("");
                    }
                  }}
                >
                  {isLoading ? (
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span class="sr-only">Loading...</span>
                    </div>
                  ) : (
                    "Reply"
                  )}
                </button>
              </div>
              <div className="mt-4 ">
                {comments.length > 0 ? (
                  <div>
                    {comments.map((comment, index) => {
                      return (
                        <div key={index} className="flex my-2">
                          <Avatar
                            image={userImage}
                            isRounded
                            theme="image"
                            size={30}
                          />
                          <span className="px-2">{comment.txt}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="row-span-3">
            <div className="font-bold text-2xl mb-5">Messages</div>
            <div className="grid grid-rows-9 grid-flow-row gap-4">
              <div className="grid grid-flow-col">
                <Avatar className="mr-2" isRounded theme="image" />
                <div>
                  <div className="grid grid-flow-col">
                    <p>Dhruv</p>
                    <span className="text-gray-500 ml-2">@dhruv</span>
                  </div>
                  <p className="text-gray-500">Hey!</p>
                </div>
              </div>
              <div className="grid grid-flow-col">
                <Avatar className="mr-2" isRounded theme="image" />
                <div>
                  <div className="grid grid-flow-col">
                    <p>Anwit</p>
                    <span className="text-gray-500 ml-2">@anwit</span>
                  </div>
                  <p className="text-gray-500">Hello User</p>
                </div>
              </div>
              <div className="grid grid-flow-col">
                <Avatar className="mr-2" isRounded theme="image" />
                <div>
                  <div className="grid grid-flow-col">
                    <p>Marie</p>
                    <span className="text-gray-500 ml-2">@marie</span>
                  </div>
                  <p className="text-gray-500">Hi, I'm marie</p>
                </div>
              </div>
              <div className="grid grid-flow-col">
                <Avatar className="mr-2" isRounded theme="image" />
                <div>
                  <div className="grid grid-flow-col">
                    <p>Darsh</p>
                    <span className="text-gray-500 ml-2">@darsh</span>
                  </div>
                  <p className="text-gray-500">I was...</p>
                </div>
              </div>
              <div className="grid grid-flow-col">
                <Avatar className="mr-2" isRounded theme="image" />
                <div>
                  <div className="grid grid-flow-col">
                    <p>Shubh</p>
                    <span className="text-gray-500 ml-2">@shubh</span>
                  </div>
                  <p className="text-gray-500">Did yo...</p>
                </div>
              </div>
              <div className="grid grid-flow-col">
                <Avatar className="mr-2" isRounded theme="image" />
                <div>
                  <div className="grid grid-flow-col">
                    <p>Kayra</p>
                    <span className="text-gray-500 ml-2">@kayra</span>
                  </div>
                  <p className="text-gray-500">Just...</p>
                </div>
              </div>
              <div className="grid grid-flow-col">
                <Avatar className="mr-2" isRounded theme="image" />
                <div>
                  <div className="grid grid-flow-col">
                    <p>Aayan</p>
                    <span className="text-gray-500 ml-2">@aayan</span>
                  </div>
                  <p className="text-gray-500">Lol</p>
                </div>
              </div>
              <div className="grid grid-flow-col">
                <Avatar className="mr-2" isRounded theme="image" />
                <div>
                  <div className="grid grid-flow-col">
                    <p>Aarav</p>
                    <span className="text-gray-500 ml-2">@aarav</span>
                  </div>
                  <p className="text-gray-500">Thanks...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
