"use client";
import { useState, useEffect } from "react";

export default function Error({ error, reset }) {
  const [text, setText] = useState("");
  const [start, setStart] = useState(false);

  useEffect(() => {
    console.log("cia");

    const typeWriter = async () => {
      setStart(true);
      for (let i = 0; i < error.message.length; i++) {
        setText((prev) => prev + error.message[i]);
        await new Promise((resolve) => setTimeout(resolve, 50)); // Pause for 100ms
      }
    };
    if (!start) {
      typeWriter(); // Start typing effect for subtext
    }
  }, []);

  return (
    <div className="flex flex-col items-start justify-start mt-[10.8rem] w-full w-full px-4 sm:px-0 sm:w-3/4 lg:w-4/6 xl:w-5/12 py-2 sm:py-10">
      <h1 className="text-neutral-200 font-semibold text-xl">
        Something went wrong
      </h1>
      <div className="mt-2 text-neutral-400  text-xs inline-block">{text}</div>
    </div>
  );
}
