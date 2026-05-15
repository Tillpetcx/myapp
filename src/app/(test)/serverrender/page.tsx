import Header from "./_components/header";
import { TabsProvider } from "./_components/tabs-context";
import TabsArea from "./_components/tabs-area";
import TabActionButtons from "./_components/tab-action-buttons";
import { fetchData } from "./fetch";
import { User, Post } from "./types";
export default async function BPage() {
  const dataPromise: Promise<{ users: User[]; posts: Post[] }> = fetchData();
  const usersPromise: Promise<User[]> = dataPromise.then((data) => data.users);
  const postsPromise: Promise<Post[]> = dataPromise.then((data) => data.posts);

  return (
    <div className="flex flex-col justify-center items-center h-dvh">
      <div className="flex-none w-full">
        <Header />
        <h1 className=" text-3xl font-bold mb-8 text-center">数据展示页面</h1>
      </div>

      <TabsProvider>
        <div className="flex-1 overflow-y-auto w-full">
          <TabsArea usersPromise={usersPromise} postsPromise={postsPromise} />
        </div>
        <div className="flex-none w-full">
          <TabActionButtons />
        </div>
      </TabsProvider>
    </div>
  );
}
