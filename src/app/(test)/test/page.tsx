import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

import NormalPage from "./page-normal";
import TransitionPage from "./page-transition";
import OptimisticPage from "./page-optimistic";
export default function TestPage() {
  return (
    <>
      <div className="flex flex-row justify-center mb-2 gap-10">
        <Button className="w-32">Test Button</Button>
        <Button className="w-32">Test Button2</Button>
      </div>

      <div className="flex flex-row mb-2">
        <div className="w-1/2 flex flex-row-reverse">
          <Button className="w-fit">Test Button</Button>
        </div>

        <div className="w-1/2">
          <Button className="w-fit">Test Button</Button>
        </div>
      </div>

      <div className="flex flex-row justify-between mb-2">
        <Button className="w-32  flex-auto text-sm inline-flex">
          <Send className="" />
          Test Button
        </Button>
        <Button className="w-32 flex-auto">Test Button2</Button>
      </div>

      <NormalPage />
      <TransitionPage />
      <OptimisticPage />
    </>
  );
}
