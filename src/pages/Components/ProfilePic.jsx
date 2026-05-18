"use client";

import Image from "next/image";

export default function ProfilePic({ src, name }) {
  const size = 32; // small profile pic (px)

  if (src) {
    return (
      <div
        className="rounded-circle overflow-hidden d-inline-block"
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt={name}
          fill
          className="object-fit-cover"
        />
      </div>
    );
  }

  // Default blank profile
  return (
    <div
      className="rounded-circle bg-light text-secondary d-inline-flex align-items-center justify-content-center"
      style={{ width: size, height: size }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" />
      </svg>
    </div>
  );
}
