import Link from "next/link";
import { classNames } from "@app/lib/utils";

export function Logo() {
  return (
    <div className="flex flex-row items-center mt-8 mx-4">
      <div className="flex rotate-[30deg]">
        <div className="bg-gray-400 w-[8px] h-4 rounded-xl"></div>
        <div className="bg-white w-[2px] h-4"></div>
        <div className="bg-gray-400 w-[8px] h-6 rounded-xl"></div>
      </div>
      <div className="flex bg-white w-[8px] h-4"></div>
      <div className="flex text-gray-800 font-bold text-2xl tracking-tight">
        <Link href="/">DUST</Link>
      </div>
    </div>
  );
}

export function PulseLogo({ animated }) {
  return (
    <div
      className={classNames(
        "flex flex-row items-center",
        animated ? "animate-pulse" : ""
      )}
    >
      <div className="flex rotate-[30deg]">
        <div className="bg-gray-400 w-[8px] h-4 rounded-xl"></div>
        <div className="bg-white w-[2px] h-4"></div>
        <div className="bg-gray-400 w-[8px] h-6 rounded-xl"></div>
      </div>
    </div>
  );
}
