"use client";
import Typewriter from "typewriter-effect";

type Props = {
  text: string[];
};

export default function TypingEffect({ text }: Props) {
  return (
    <Typewriter
      options={{
        strings: text,
        autoStart: true,
        loop: true,
      }}
    />
  );
}
