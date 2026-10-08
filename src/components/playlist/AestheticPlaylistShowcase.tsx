"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import discoBallSvg from "@/assets/playlist/disco-ball.svg";
import vinylSvg from "@/assets/playlist/vinyl.svg";
import lipsSvg from "@/assets/playlist/lips.svg";
import heartsSvg from "@/assets/playlist/hearts.svg";
import starsSvg from "@/assets/playlist/stars.svg";
import cassetteSvg from "@/assets/playlist/cassette.svg";
import spotifyLogoSvg from "@/assets/playlist/spotify-logo.svg";
import defaultCoverSvg from "@/assets/playlist/cover-art.svg";

export interface PlaylistData {
  id?: string;
  title?: string;
  description?: string | null;
  embedUrl?: string;
  image?: string | null;
  authorName?: string;
}

interface AestheticPlaylistShowcaseProps {
  playlist?: PlaylistData | null;
  className?: string;
}

export function AestheticPlaylistShowcase({
  playlist,
  className = "",
}: AestheticPlaylistShowcaseProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const title = playlist?.title || "Feel Worthy Playlist";
  const displayTitle = playlist?.title || "feel worthy";
  const authorName = playlist?.authorName || "Playlist by mihika";
  const embedUrl =
    playlist?.embedUrl ||
    "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator";

  return (
    <div className={`w-full max-w-5xl mx-auto ${className}`}>
      {/* Outer Aesthetic Container matching website color theme */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#fffdf0] via-[#f0f4fc] to-[#e4ebfc] p-6 sm:p-10 md:p-14 border border-[#d3defa] shadow-xl">
        
        {/* Subtle Background Glows */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#d3defa]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT / CENTER: Retro Dynamic Card Stage */}
          <div className="lg:col-span-7 flex justify-center py-6">
            <div className="relative max-w-sm sm:max-w-md w-full">
              
              {/* STICKER 1: Hanging Disco Ball (Top Left) */}
              <motion.div
                initial={{ y: -10, rotate: -4 }}
                animate={{ y: [0, -8, 0], rotate: [-4, 2, -4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-14 sm:-top-20 -left-6 sm:-left-10 z-30 w-24 sm:w-32 drop-shadow-xl pointer-events-none"
              >
                <Image
                  src={discoBallSvg}
                  alt="Disco Ball"
                  width={140}
                  height={170}
                  className="w-full h-auto object-contain"
                  priority
                />
              </motion.div>

              {/* STICKER 2: Vinyl Record + Lips (Top Right) */}
              <motion.div
                initial={{ rotate: 12 }}
                animate={{ rotate: [12, 18, 12] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 sm:-top-8 -right-4 sm:-right-8 z-20 flex items-center justify-center drop-shadow-lg"
              >
                <div className="relative">
                  {/* Rotating Vinyl Disc */}
                  <motion.div
                    animate={{ rotate: isPlaying ? 360 : [0, 5, 0] }}
                    transition={
                      isPlaying
                        ? { duration: 3, repeat: Infinity, ease: "linear" }
                        : { duration: 5, repeat: Infinity, ease: "easeInOut" }
                    }
                    className="w-20 sm:w-28 h-20 sm:h-28"
                  >
                    <Image
                      src={vinylSvg}
                      alt="Vinyl Record"
                      width={120}
                      height={120}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>

                  {/* Lips Kiss Mark Sticker on top of Vinyl */}
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: -8 }}
                    className="absolute -top-3 -right-2 w-12 sm:w-16 z-30 drop-shadow-md cursor-pointer"
                  >
                    <Image
                      src={lipsSvg}
                      alt="Lips Kiss Sticker"
                      width={70}
                      height={50}
                      className="w-full h-auto object-contain"
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* STICKER 3: Red Heart Cluster (Left Side) */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[42%] -left-8 sm:-left-12 z-30 w-16 sm:w-20 drop-shadow-lg"
              >
                <Image
                  src={heartsSvg}
                  alt="Red Hearts"
                  width={90}
                  height={100}
                  className="w-full h-auto object-contain"
                />
              </motion.div>

              {/* STICKER 4: Silver Star Stickers (Bottom Left) */}
              <motion.div
                animate={{ scale: [1, 1.05, 1], rotate: [-2, 2, -2] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-8 -left-6 sm:-left-10 z-30 w-20 sm:w-24 drop-shadow-xl"
              >
                <Image
                  src={starsSvg}
                  alt="Silver Stars"
                  width={110}
                  height={110}
                  className="w-full h-auto object-contain"
                />
              </motion.div>

              {/* STICKER 5: Cassette Tape (Bottom Right) */}
              <motion.div
                initial={{ rotate: 10 }}
                whileHover={{ scale: 1.08, rotate: 5 }}
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -right-6 sm:-right-10 z-30 w-36 sm:w-48 drop-shadow-2xl cursor-pointer"
              >
                <Image
                  src={cassetteSvg}
                  alt="Cassette Tape"
                  width={200}
                  height={125}
                  className="w-full h-auto object-contain"
                />
              </motion.div>

              {/* MAIN SPOTIFY PLAYLIST CARD */}
              <motion.div
                whileHover={{ scale: 1.02, rotate: -1 }}
                className="relative z-10 bg-[#28292e] text-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-white/10 transform -rotate-2 transition-transform duration-300"
              >
                {/* Playlist Cover Art Image Box */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#faf9f5] flex items-center justify-center border border-white/20 shadow-inner">
                  {playlist?.image ? (
                    <Image
                      src={playlist.image}
                      alt={displayTitle}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Image
                      src={defaultCoverSvg}
                      alt="Feel Worthy Cover Art"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Playlist Information Footer */}
                <div className="mt-5 space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                    {displayTitle}
                  </h3>
                  <p className="text-sm text-zinc-400 font-medium">
                    {authorName}
                  </p>
                </div>

                {/* Spotify Logo Icon at bottom */}
                <div className="mt-4 flex items-center gap-2 text-zinc-300">
                  <Image
                    src={spotifyLogoSvg}
                    alt="Spotify"
                    width={22}
                    height={22}
                    className="w-5 h-5 opacity-90"
                  />
                  <span className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">
                    Spotify
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* RIGHT: Text Content & Action Button */}
          <div className="lg:col-span-5 flex flex-col items-start lg:pl-4 space-y-5 text-left">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#d3defa] text-[#2b4c9b]">
                Featured Music
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1b1c1b] tracking-tight font-serif leading-tight">
                {title}
              </h2>
              {playlist?.description && (
                <p className="text-base text-zinc-600 font-normal max-w-md">
                  {playlist.description}
                </p>
              )}
            </div>

            {/* Tap & Enjoy Pill Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#4a62b0] hover:bg-[#3a4f96] text-white font-semibold text-base shadow-lg shadow-[#4a62b0]/30 transition-all duration-200 cursor-pointer"
            >
              {isPlaying ? "close player <3" : "tap & enjoy <3"}
            </motion.button>
          </div>
        </div>

        {/* EXPANDABLE SPOTIFY EMBED PLAYER */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="mt-8 pt-6 border-t border-[#d3defa]/60 overflow-hidden"
            >
              <div className="rounded-2xl overflow-hidden shadow-lg border border-border bg-white p-2">
                <iframe
                  title={title}
                  src={embedUrl}
                  className="h-44 w-full rounded-xl"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
