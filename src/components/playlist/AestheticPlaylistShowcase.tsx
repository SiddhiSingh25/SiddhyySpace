"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import audioCDImg from "@/assets/playlist/audioCD.png";
import cherryImg from "@/assets/playlist/cherry.png";
import headphoneImg from "@/assets/playlist/headphone.png";
import tapeRecorderImg from "@/assets/playlist/tapeRecorder.png";
import spotifyImg from "@/assets/playlist/spotify.png";
import flowerImg from "@/assets/flower.webp";
import { formatSpotifyEmbedUrl } from "@/features/spotify/utils";

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

// ─── Empty State ─────────────────────────────────────────────────────────────

function PlaylistEmptyState() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl p-10 sm:p-16 flex flex-col items-center justify-center gap-5 min-h-[260px] text-center">
        {/* static CD decoration */}
        <div className="relative z-10 w-20 h-20 opacity-50 pointer-events-none">
          <Image
            src={audioCDImg}
            alt="No playlists yet"
            fill
            className="object-contain filter grayscale"
          />
        </div>

        <div className="relative z-10 space-y-2">
          <h3 className="text-2xl font-bold font-serif text-[#1b1c1b] tracking-tight">
            No playlists yet
          </h3>
          <p className="text-[#6b6e6a] font-sans text-base max-w-xs mx-auto">
            Curated soundtracks will appear here soon. Check back later.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Showcase ────────────────────────────────────────────────────────────

export function AestheticPlaylistShowcase({
  playlist,
  className = "",
}: AestheticPlaylistShowcaseProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Show empty state when there is genuinely no playlist from the server
  if (!playlist) {
    return <PlaylistEmptyState />;
  }

  const title = playlist.title ?? "Untitled Playlist";
  const displayTitle = playlist.title ?? "Untitled Playlist";
  const authorName = playlist.authorName ?? "Playlist";
  const embedUrl = playlist.embedUrl
    ? formatSpotifyEmbedUrl(playlist.embedUrl)
    : null;

  return (
    <div className={`w-full max-w-5xl mx-auto ${className}`}>
      {/* Outer Aesthetic Container */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 md:p-14">

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* LEFT / CENTER: Retro Card Stage */}
          <div className="lg:col-span-7 flex justify-center py-6">
            <div className="relative max-w-sm sm:max-w-md w-full">

              {/* STICKER: Audio CD (Top Left) */}
              <div className="absolute -top-12 sm:-top-16 -left-6 sm:-left-10 z-30 w-24 sm:w-32 pointer-events-none">
                <Image
                  src={audioCDImg}
                  alt="Audio CD"
                  width={140}
                  height={140}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>

              {/* STICKER: Cherry Photo Badge (Top Right) */}
              <div className="absolute -top-4 sm:-top-6 right-8 sm:right-12 z-20">
                <div className="relative w-16 sm:w-22 h-16 sm:h-22 rounded-2xl overflow-hidden transform rotate-6">
                  <Image
                    src={cherryImg}
                    alt="Cherry aesthetics"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>



              {/* STICKER: Retro Tape Recorder (Bottom Right) */}
              {/* <div className="absolute -bottom-10 -right-6 sm:-right-10 z-30 w-32 sm:w-44">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src={tapeRecorderImg}
                    alt="Tape Recorder"
                    fill
                    className="object-cover"
                  />
                </div>
              </div> */}

              {/* MAIN SPOTIFY PLAYLIST CARD */}
              <div className="relative z-10 bg-[#1b1c1b] text-white rounded-3xl p-5 sm:p-7 border border-white/10 transform -rotate-2">
                {/* Playlist Cover Art Image Box */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#faf9f5] flex items-center justify-center">
                  {playlist.image ? (
                    <Image
                      src={playlist.image}
                      alt={displayTitle}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Image
                      src={headphoneImg}
                      alt="Playlist Cover Art"
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Playlist Information Footer */}
                <div className="mt-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                      {displayTitle}
                    </h3>
                    <p className="text-sm text-zinc-400 font-medium font-sans">
                      {authorName}
                    </p>
                  </div>
                  <div className="shrink-0 ml-3">
                    <Image
                      src={spotifyImg}
                      alt="Spotify"
                      width={28}
                      height={28}
                      className="w-7 h-7 object-contain"
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT: Text Content & Action Button */}
          <div className="lg:col-span-5 flex flex-col items-start lg:pl-4 space-y-5 text-left">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#d3defa]/70 text-[#4a62b0] border border-[#d3defa] font-sans">
                  <Image
                    src={flowerImg}
                    alt="Flower icon"
                    width={14}
                    height={14}
                    className="w-3.5 h-3.5 object-contain"
                  />
                  Featured Music
                </span>
                <span className="great-vibes-regular text-2xl text-[#4a62b0] select-none">
                  my favorite tunes ~
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1b1c1b] tracking-tight font-serif leading-tight">
                {title}
              </h2>

              {playlist.description && (
                <p className="text-base text-[#6b6e6a] font-normal max-w-md font-sans leading-relaxed">
                  {playlist.description}
                </p>
              )}
            </div>

            {/* Tap & Enjoy Pill Button — only shown when an embed URL exists */}
            {embedUrl && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#4a62b0] hover:bg-[#3a4f96] text-white font-sans font-semibold text-base transition-all duration-200 cursor-pointer"
              >
                <Image
                  src={flowerImg}
                  alt="Flower icon button"
                  width={18}
                  height={18}
                  className="w-4 h-4 object-contain brightness-200"
                />
                {isPlaying ? "close player <3" : "tap & enjoy <3"}
              </motion.button>
            )}
          </div>
        </div>

        {/* EXPANDABLE SPOTIFY EMBED PLAYER */}
        <AnimatePresence>
          {isPlaying && embedUrl && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="mt-8 pt-6 border-t border-[#d3defa]/60 overflow-hidden"
            >
              <div className="rounded-2xl overflow-hidden p-2 bg-[#ffffff]/80 border border-[#d3defa]">
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
