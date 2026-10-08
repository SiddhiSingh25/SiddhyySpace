"use client";

import React, { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

import heroBinoculars from "@/assets/home/hero-object-1.webp";
import heroKeyboard from "@/assets/home/hero-object-2.webp";
import heroPen from "@/assets/home/hero-object-3.webp";
import heroCoffee from "@/assets/home/hero-object-coffee.webp";
import heroCoins from "@/assets/home/hero-object-coins.webp";
import flowerImg from "@/assets/flower.webp";

const HERO_VIDEO = "/home/video.mp4";

const NAV_LINKS = [
  { label: "Blogs", href: "/blogs" },
  { label: "Books", href: "/books" },
  { label: "Products", href: "/products" },
  { label: "Playlists", href: "/playlists" },
  { label: "Celebrations", href: "/celebrations" },
];

function useIstClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date());

    setTime(format());
    const id = setInterval(() => setTime(format()), 15_000);
    return () => clearInterval(id);
  }, []);

  return time;
}

function useTypewriter(
  phrases: string[],
  typingMs = 55,
  pauseMs = 1600,
  deletingMs = 30,
) {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex % phrases.length];

    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), pauseMs);
      return () => clearTimeout(t);
    }

    if (deleting && text === "") {
      setDeleting(false);
      setPhraseIndex((i) => (i + 1) % phrases.length);
      return;
    }

    const t = setTimeout(() => {
      setText((prev) =>
        deleting
          ? current.slice(0, prev.length - 1)
          : current.slice(0, prev.length + 1),
      );
    }, deleting ? deletingMs : typingMs);

    return () => clearTimeout(t);
  }, [text, deleting, phraseIndex, phrases, typingMs, pauseMs, deletingMs]);

  return text;
}

function ClockBadge() {
  const time = useIstClock();
  return (
    <span className="inline-flex items-center rounded-full border border-[#c5d0ef] bg-white/80 px-3.5 py-1.5 text-[13px] text-[#5a6280] shadow-sm backdrop-blur-sm">
      India{time ? ` · ${time}` : ""}
    </span>
  );
}

function FloatingImg({
  src,
  alt,
  className,
  wrapClassName,
}: {
  src: StaticImageData;
  alt: string;
  className?: string;
  wrapClassName?: string;
}) {
  return (
    <div
      className={`absolute drop-shadow-[0_16px_28px_rgba(40,55,110,0.18)] ${wrapClassName ?? ""}`}
    >
      <Image
        src={src}
        alt={alt}
        className={`select-none object-contain ${className ?? ""}`}
        draggable={false}
        sizes="(max-width: 1024px) 120px, 420px"
      />
    </div>
  );
}

function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const tryPlay = () => {
      void video.play().catch(() => {
        // Autoplay can still be blocked; user gesture isn't required for muted media in most browsers.
      });
    };

    if (video.readyState >= 2) tryPlay();
    else video.addEventListener("loadeddata", tryPlay, { once: true });

    return () => video.removeEventListener("loadeddata", tryPlay);
  }, []);

  return (
    <div className="absolute left-0 top-[60px] w-[270px] -rotate-3 animate-float-slow rounded-2xl border border-white/70 bg-[#1b1c1b] shadow-[0_20px_40px_rgba(40,55,110,0.22)] ring-1 ring-[#4a62b0]/15">
      <div className="relative overflow-hidden rounded-2xl">
        <video
          ref={ref}
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={`${siteConfig.name} intro`}
          className="h-[230px] w-[270px] select-none object-cover"
        />
      </div>
      <div className="pointer-events-none absolute -right-3.5 -top-3.5 z-10">
        <Image
          src={flowerImg}
          alt="Rotating flower"
          className="h-12 w-12 select-none object-contain animate-spin-slow drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
          draggable={false}
        />
      </div>
    </div>
  );
}

function DesktopFloatingLeft() {
  return (
    <div className="relative hidden h-[440px] w-[380px] shrink-0 lg:block">
      <HeroVideo />
      <FloatingImg
        src={heroPen}
        alt=""
        wrapClassName="right-[28px] top-0 w-[44px] rotate-[16deg] animate-float-medium"
        className="h-[190px] w-[44px]"
      />
      <FloatingImg
        src={heroBinoculars}
        alt=""
        wrapClassName="left-[8px] bottom-0 w-[150px] -rotate-6 animate-float-fast"
        className="h-[110px] w-[150px]"
      />
    </div>
  );
}

function DesktopFloatingRight() {
  return (
    <div className="relative hidden h-[440px] w-[400px] shrink-0 lg:block">
      <FloatingImg
        src={heroKeyboard}
        alt=""
        wrapClassName="right-0 top-[100px] w-[340px] rotate-[8deg] animate-float-slow"
        className="h-[200px] w-[340px]"
      />
      <FloatingImg
        src={heroCoffee}
        alt=""
        wrapClassName="right-[90px] top-0 w-[100px] rotate-[3deg] animate-float-medium"
        className="h-[180px] w-[100px]"
      />
      <FloatingImg
        src={heroCoins}
        alt=""
        wrapClassName="right-[24px] bottom-[24px] w-[150px] -rotate-[7deg] animate-float-fast"
        className="h-[100px] w-[150px]"
      />
    </div>
  );
}

function MobileFloatingRow() {
  const items = [
    { src: heroPen, alt: "Pen" },
    { src: heroKeyboard, alt: "Keyboard" },
    { src: heroCoffee, alt: "Iced coffee" },
    { src: heroCoins, alt: "Coins" },
    { src: heroBinoculars, alt: "Binoculars" },
  ];

  return (
    <div className="mt-10 flex items-end justify-center gap-4 sm:gap-5 lg:hidden">
      {items.map((it, i) => (
        <Image
          key={it.src.src}
          src={it.src}
          alt={it.alt}
          draggable={false}
          className={`h-12 w-auto select-none object-contain  drop-shadow-[0_10px_16px_rgba(40,55,110,0.16)] sm:h-14 ${i % 2 === 0 ? "animate-float-medium" : "animate-float-fast"
            }`}
          sizes="56px"
        />
      ))}
    </div>
  );
}

export default function Home() {
  const typed = useTypewriter([
    "writing quietly...",
    "curating books...",
    "sharing recommendations...",
  ]);

  return (
    <section className="relative  overflow-hidden border-b border-[#dce4f5] bg-[linear-gradient(165deg,#ffffff_0%,#eef2fb_42%,#d3defa66_72%,#ffffff_100%)] text-[#1b1c1b]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(211,222,250,0.55),transparent_55%),radial-gradient(ellipse_at_85%_15%,rgba(74,98,176,0.08),transparent_45%)]"
      />

      <div className="relative mx-auto flex max-w-6xl items-center justify-center gap-4 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:justify-between lg:pt-32">
        <DesktopFloatingLeft />

        <div className="flex max-w-xl flex-col items-center text-center">



          <h1 className="mt-4 font-display text-[28px] leading-[1.2] text-[#1b1c1b] sm:text-[36px]">
            A calm space for thoughtful work
          </h1>

          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-[#6b6e6a] sm:text-[17px]">
            {siteConfig.description}
          </p>

          <p className="mt-7 text-[17px] italic text-[#4a62b0]/90">
            <span className="mr-1.5 text-[#8fa0d0]">•</span>
            {typed}
            <span className="ml-0.5 inline-block h-[1em] w-px animate-pulse bg-[#4a62b0]/60 align-middle" />
          </p>

          <MobileFloatingRow />

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/blogs"
              className="inline-flex items-center rounded-full bg-[#4a62b0] px-6 py-3 text-[15px] font-medium text-white no-underline shadow-[0_10px_24px_rgba(74,98,176,0.28)] transition hover:bg-[#3a4f96] hover:text-white"
            >
              Say hii!
            </Link>
            {/* <Link
              href="/books"
              className="inline-flex items-center rounded-full border border-[#b8c5e8] bg-white/80 px-6 py-3 text-[15px] font-medium text-[#3a4f96] no-underline backdrop-blur-sm transition hover:border-[#4a62b0] hover:bg-white hover:text-[#3a4f96]"
            >
              Explore books
            </Link> */}
          </div>


        </div>

        <DesktopFloatingRight />
      </div>

      <style jsx global>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }
        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-float-slow {
          animation: float-slow 6.5s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 5s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float-slow,
          .animate-float-medium,
          .animate-float-fast,
          .animate-spin-slow {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
