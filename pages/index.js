import { getSession, useSession } from "next-auth/react";
import { connectToDatabase } from "../util/mongodb";
import { AnimatePresence } from "framer-motion";
import Modal from "../components/Modal";
import { useRecoilState, useRecoilValue } from "recoil";
import { modalState, modalTypeState } from "../atoms/modalAtom";
import Head from "next/head";
import Feed from "../components/Feed";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";

export default function Home({ posts, articles }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/home");
    },
  });
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const modalType = useRecoilValue(modalTypeState);
  const { theme, setTheme } = useTheme();

  console.log("Current theme is", theme);

  return (
    <div className="bg-[#F3F2EF] dark:bg-black h-screen overflow-y-scroll md:space-y-6">
      <Head>
        <title>Feed | LinkedIn</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex justify-center gap-x-5 px-4 sm:px-12">
        <div className="flex flex-col md:flex-row gap-x-5 gap-y-5">
          <Sidebar />
          <Feed posts={posts} />
        </div>
        <Widgets articles={articles} />
        <AnimatePresence>
          {modalOpen && (
            <Modal handleClose={() => setModalOpen(false)} type={modalType} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  // Check if the user is authenticated on the server
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/home",
      },
    };
  }

  // Get posts on SSR
  const { db } = await connectToDatabase();
  const posts = await db
    .collection("posts")
    .find()
    .sort({ timestamp: -1 })
    .toArray();

  // Get News
  const results = await fetch(
    `https://newsapi.org/v2/top-headlines?country=ae&apiKey=${process.env.NEWS_API_KEY}`
  ).then((res) => res.json());

  return {
    props: {
      session,
      articles: results.articles,
      posts: posts.map((post) => ({
        _id: post._id.toString(),
        input: post.input,
        photoUrl: post.photoUrl,
      })),
    },
  };
}
