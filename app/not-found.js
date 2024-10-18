"use client";
import { useState, useEffect } from "react";

export default function NotFound() {
  const [text, setText] = useState("");
  const [start, setStart] = useState(false);

  const fullText = "I hope you find what you are looking for";

  useEffect(() => {
    console.log("cia");

    const typeWriter = async () => {
      setStart(true);
      for (let i = 0; i < fullText.length; i++) {
        setText((prev) => prev + fullText[i]);
        await new Promise((resolve) => setTimeout(resolve, 100)); // Pause for 100ms
      }
    };
    if (!start) {
      typeWriter(); // Start typing effect for subtext
    }
  }, []);

  return (
    <div className="flex flex-col items-start justify-start mt-40 w-80 ">
      <h1 className="text-neutral-200 font-semibold text-xl">
        There is nothing here
      </h1>
      <div className="mt-2 text-neutral-400  text-xs inline-block">{text}</div>
    </div>
  );
}
