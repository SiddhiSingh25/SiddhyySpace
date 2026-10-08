"use client";

/**
 * EnvelopeSection.tsx
 * ------------------------------------------------------------------
 * Next.js (App Router) component. Recreates the "Content Creation
 * Experience" section: a paper envelope stuffed with photos, a
 * "Trusted by" note and a "Visual Work" tag. Click anything in the
 * pocket to pull it out; click the backdrop / press Esc to put it back.
 *
 * Install:   npm i framer-motion
 * Use:       import EnvelopeSection from "@/components/EnvelopeSection";
 *            <EnvelopeSection />
 *
 * Replace the `src` values in ITEMS with your own images
 * (put them in /public and use "/photos/x.jpg").
 * ------------------------------------------------------------------
 */

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Barlow_Condensed, Playfair_Display } from "next/font/google";

const sans = Barlow_Condensed({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});
const serif = Playfair_Display({
    subsets: ["latin"],
    style: ["italic"],
    weight: ["400"],
});

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type Item = {
    id: string;
    kind: "photo" | "note" | "tag";
    label: string; // caption shown when picked up
    src?: string;
    x: number; // left, % of envelope scene
    y: number; // top, % of envelope scene
    w: number; // width, % of envelope scene
    ratio: number; // width / height
    r: number; // resting rotation (deg)
    z: number;
};

const pic = (seed: string, w = 800, h = 1000) =>
    `https://picsum.photos/seed/${seed}/${w}/${h}`;

const ITEMS: Item[] = [
    { id: "phone", kind: "photo", label: "Behind the scenes, golden hour", src: pic("goldenhour", 1000, 800), x: 31, y: 4, w: 40, ratio: 1.25, r: 0, z: 2 },
    { id: "tag", kind: "tag", label: "Featured visual work", x: 70, y: 3, w: 6.5, ratio: 0.125, r: 8, z: 3 },
    { id: "note", kind: "note", label: "Trusted by brands like", x: 14, y: 28, w: 30, ratio: 1.1, r: -7, z: 4 },
    { id: "beach", kind: "photo", label: "Coastline campaign", src: pic("coastline", 600, 800), x: 1.5, y: 29, w: 16, ratio: 0.75, r: -8, z: 5 },
    { id: "van", kind: "photo", label: "Road trip lifestyle shoot", src: pic("vanlife", 800, 1000), x: 7, y: 34, w: 20, ratio: 0.8, r: -5, z: 6 },
    { id: "sunset", kind: "photo", label: "Sunset dinner, destination shoot", src: pic("sunsetdinner", 780, 1000), x: 33, y: 29, w: 24, ratio: 0.78, r: -4, z: 7 },
    { id: "horses", kind: "photo", label: "Desert editorial", src: pic("desertride", 880, 1000), x: 43, y: 29, w: 27, ratio: 0.88, r: 3, z: 8 },
    { id: "woman", kind: "photo", label: "Resort lifestyle", src: pic("resortday", 800, 1000), x: 73, y: 27, w: 20, ratio: 0.8, r: 4, z: 6 },
    { id: "peek", kind: "photo", label: "Product flat lay", src: pic("flatlay", 1000, 840), x: 33, y: 58, w: 22, ratio: 1.2, r: -3, z: 9 },
];

const BRANDS = [
    "GoPro",
    "Reef",
    "Roxy",
    "Von Zipper",
    "Pura Vida",
    "Conrad Punta De Mita",
    "Google Pixel",
    "Rancho Valencia Resort & Spa",
];

/* ------------------------------------------------------------------ */
/* Card faces (sized with container-query units so they scale 1:1      */
/* between the pocket and the picked-up view)                          */
/* ------------------------------------------------------------------ */

function CardFace({ item }: { item: Item }) {
    if (item.kind === "photo") {
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: "#f4f4f4",
                    padding: "3.5cqw",
                    boxSizing: "border-box",
                    boxShadow: "0 6px 18px rgba(0,0,0,.28)",
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={item.src}
                    alt={item.label}
                    draggable={false}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
            </div>
        );
    }

    if (item.kind === "note") {
        return (
            <div
                className={sans.className}
                style={{
                    width: "100%",
                    height: "100%",
                    background: "#becEAa",
                    color: "#101010",
                    padding: "9cqw 8cqw",
                    boxSizing: "border-box",
                    boxShadow: "0 6px 18px rgba(0,0,0,.22)",
                    textAlign: "center",
                }}
            >
                <div style={{ fontSize: "4.6cqw", letterSpacing: ".06em", textTransform: "uppercase" }}>
                    Trusted by brands like
                </div>
                <div style={{ fontSize: "9.2cqw", lineHeight: 1.18, marginTop: "5cqw", fontWeight: 400 }}>
                    {BRANDS.join(", ")}
                </div>
            </div>
        );
    }

    // tag
    return (
        <div
            className={sans.className}
            style={{
                width: "100%",
                height: "100%",
                background: "#9bb4e3",
                color: "#101010",
                boxShadow: "0 4px 12px rgba(0,0,0,.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
                flexDirection: "column",
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                padding: "10cqw 0",
                boxSizing: "border-box",
            }}
        >
            <span style={{ fontSize: "20cqw", letterSpacing: ".08em", textTransform: "uppercase" }}>Featured</span>
            <span style={{ fontSize: "44cqw", lineHeight: 1 }}>Visual Work</span>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function EnvelopeSection() {
    const [activeId, setActiveId] = useState<string | null>(null);
    const activeIndex = ITEMS.findIndex((i) => i.id === activeId);
    const active = activeIndex >= 0 ? ITEMS[activeIndex] : null;

    const close = useCallback(() => setActiveId(null), []);
    const step = useCallback(
        (dir: 1 | -1) => {
            if (activeIndex < 0) return;
            setActiveId(ITEMS[(activeIndex + dir + ITEMS.length) % ITEMS.length].id);
        },
        [activeIndex]
    );

    // keyboard + scroll lock while an item is out of the pocket
    useEffect(() => {
        if (!active) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
        };
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [active, close, step]);

    return (
        <section
            className={sans.className}
            style={{
                background: "#101010",
                color: "#f4f4f4",
                padding: "clamp(40px,6vw,72px) 16px 0",
                overflow: "hidden",
                position: "relative",
            }}
        >
            <style>{`
        .env-copy{display:grid;grid-template-columns:1fr 1fr;gap:28px;max-width:560px;margin:0 auto}
        @media (max-width:640px){.env-copy{grid-template-columns:1fr}}
        .env-item:focus-visible{outline:2px solid #9bb4e3;outline-offset:4px}
        @media (prefers-reduced-motion:reduce){.env-doodle{display:none}}
      `}</style>

            {/* heading */}
            <p
                style={{
                    textAlign: "center",
                    fontSize: 12,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    margin: 0,
                }}
            >
                Content creation experience
            </p>
            <h2
                style={{
                    fontWeight: 400,
                    textAlign: "center",
                    margin: "18px auto 0",
                    maxWidth: 960,
                    fontSize: "clamp(34px,6.2vw,66px)",
                    lineHeight: 1.02,
                    letterSpacing: "-0.01em",
                }}
            >
                I&rsquo;ve been part of lifestyle campaigns, product launches, UGC-style content, and
                destination shoots,{" "}
                <span className={serif.className} style={{ fontStyle: "italic" }}>
                    creating assets designed for modern platforms
                </span>
            </h2>

            {/* copy + doodle */}
            <div style={{ position: "relative", marginTop: 40 }}>
                <svg
                    className="env-doodle"
                    aria-hidden
                    viewBox="0 0 192 210"
                    width="170"
                    height="186"
                    fill="none"
                    style={{ position: "absolute", left: "calc(50% - 440px)", top: -10, maxWidth: "18vw" }}
                >
                    <path
                        d="M33.8 8.1C32.4 8.7 27.1 13.3 20.7 20c-3.1 3.3-6.3 8.5-7.9 17-2.9 15.5-3.4 26.7-3.1 30.6.9 13.7 4.2 20.1 9.8 28.9 4.3 6.8 10.1 10.4 17.9 14.6 11.9 6.4 27.1 3.8 39.1-.6 12-4.4 14.8-11.1 17.2-17.7 1.6-4.6 1.1-8.3.5-9.9-.5-1.6-2.1-2.7-3.7-3.7-1.9-1.1-4.8-1.2-7.7-1.2-6.3.1-9.8 9.4-11.4 14.5-1.3 4-.6 7.6.2 9.8 1.5 3.9 6.4 5.4 20.3 8.2 11.4 2.3 31.8 4.6 43.9 6.6 15.1 2.5 22 6.2 28.5 9.7 8.4 4.5 14.5 12.6 17.4 18.4.6 1.2.9 2.9 1 5.1.8 16.9-3.7 35-14.6 47.9"
                        stroke="#f4f4f4"
                        strokeWidth="1.4"
                        strokeDasharray="5 5"
                    />
                </svg>

                <div className="env-copy" style={{ fontSize: 15, lineHeight: 1.25 }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>
                        Alongside my marketing work, I model for lifestyle, travel, and consumer brands with a
                        natural, story-driven approach.
                    </p>
                    <p style={{ margin: 0 }}>
                        With over 30 shoots behind me, I&rsquo;ve learned how to move naturally on set, take
                        direction with ease, and bring a calm, positive energy to every project. I understand
                        timing, angles, and storytelling through subtle expression, helping brands capture
                        moments that feel real rather than staged.
                    </p>
                </div>
            </div>

            <p
                style={{
                    textAlign: "center",
                    fontSize: 12,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    opacity: 0.6,
                    margin: "36px 0 0",
                }}
            >
                Click anything in the envelope to pull it out
            </p>

            {/* ---------------- envelope scene ---------------- */}
            <LayoutGroup>
                <div
                    style={{
                        position: "relative",
                        width: "min(760px, 94vw)",
                        aspectRatio: "760 / 520",
                        margin: "12px auto 0",
                    }}
                >
                    {/* back of envelope */}
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: "66%",
                            background: "#ededed",
                            borderRadius: "28px 28px 0 0",
                            boxShadow: "inset 0 10px 18px rgba(0,0,0,.08)",
                        }}
                    />

                    {/* items inside the pocket */}
                    {ITEMS.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ y: 70, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                            style={{
                                position: "absolute",
                                left: `${item.x}%`,
                                top: `${item.y}%`,
                                width: `${item.w}%`,
                                zIndex: item.z,
                            }}
                        >
                            {activeId === item.id ? (
                                <div style={{ width: "100%", aspectRatio: String(item.ratio) }} />
                            ) : (
                                <motion.button
                                    type="button"
                                    layoutId={item.id}
                                    className="env-item"
                                    aria-label={`Pick up: ${item.label}`}
                                    onClick={() => setActiveId(item.id)}
                                    initial={false}
                                    animate={{ rotate: item.r }}
                                    whileHover={{ y: -16, scale: 1.04 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        aspectRatio: String(item.ratio),
                                        padding: 0,
                                        border: 0,
                                        background: "transparent",
                                        cursor: "pointer",
                                        containerType: "inline-size",
                                    }}
                                >
                                    <CardFace item={item} />
                                </motion.button>
                            )}
                        </motion.div>
                    ))}

                    {/* envelope front (sits over the bottom of the items) */}
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: "66%",
                            zIndex: 20,
                            pointerEvents: "none",
                            filter: "drop-shadow(0 -6px 10px rgba(0,0,0,.22))",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background: "#f4f4f4",
                                clipPath: "polygon(0 30%, 50% 62%, 100% 30%, 100% 100%, 0 100%)",
                                borderRadius: "0 0 0 0",
                                pointerEvents: "auto",
                            }}
                        />
                        {/* centre flap */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background: "#e9e9e9",
                                clipPath: "polygon(24% 100%, 38% 60%, 62% 60%, 76% 100%)",
                                pointerEvents: "auto",
                            }}
                        />
                    </div>
                </div>

                {/* ---------------- picked-up layer ---------------- */}
                <AnimatePresence>
                    {active && (
                        <motion.div
                            key="backdrop"
                            onClick={close}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            style={{
                                position: "fixed",
                                inset: 0,
                                zIndex: 1000,
                                background: "rgba(10,10,10,.82)",
                                backdropFilter: "blur(6px)",
                                WebkitBackdropFilter: "blur(6px)",
                                cursor: "zoom-out",
                            }}
                        />
                    )}
                </AnimatePresence>

                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 1001,
                        pointerEvents: "none",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 18,
                    }}
                >
                    <AnimatePresence>
                        {active && (
                            <motion.div
                                key={active.id}
                                layoutId={active.id}
                                initial={{ rotate: active.r }}
                                animate={{ rotate: 0 }}
                                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                                style={{
                                    width: `min(86vw, 440px, calc(70vh * ${active.ratio}))`,
                                    aspectRatio: String(active.ratio),
                                    containerType: "inline-size",
                                    pointerEvents: "auto",
                                }}
                            >
                                <CardFace item={active} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {active && (
                            <motion.div
                                key="chrome"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
                                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                                style={{
                                    pointerEvents: "auto",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 16,
                                    color: "#f4f4f4",
                                    fontSize: 15,
                                }}
                            >
                                <button type="button" onClick={() => step(-1)} aria-label="Previous" style={navBtn}>
                                    ‹
                                </button>
                                <span style={{ minWidth: 200, textAlign: "center" }}>{active.label}</span>
                                <button type="button" onClick={() => step(1)} aria-label="Next" style={navBtn}>
                                    ›
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {active && (
                            <motion.button
                                key="close"
                                type="button"
                                onClick={close}
                                aria-label="Put back in envelope"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    ...navBtn,
                                    position: "fixed",
                                    top: 20,
                                    right: 20,
                                    width: "auto",
                                    padding: "0 16px",
                                    fontSize: 14,
                                    pointerEvents: "auto",
                                }}
                            >
                                Put back
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </LayoutGroup>
        </section>
    );
}

const navBtn: React.CSSProperties = {
    height: 40,
    width: 40,
    borderRadius: 999,
    border: "1px solid rgba(244,244,244,.5)",
    background: "transparent",
    color: "#f4f4f4",
    fontSize: 22,
    lineHeight: 1,
    cursor: "pointer",
};