"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import avatar from "@/assets/profile/profile.png";
import avatarAbout from "@/assets/profile/about.jpeg";

import paperImg from "@/assets/aboutDecor/paper.webp";
import pinkPaperImg from "@/assets/aboutDecor/pinkPaperPiece.webp";
import parisImg from "@/assets/aboutDecor/paris.webp";
import pinImg from "@/assets/aboutDecor/ping.webp";
import tapeImg from "@/assets/aboutDecor/tape.webp";

import { FloatingText } from "@/components/ui/FloatingText";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Text } from "@/components/typography/Text";


const spring = { type: "spring" as const, stiffness: 70, damping: 14 };
const view = { once: true, margin: "-50px" };

const About = () => {
    return (
        <Section>
            <Container>
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-8">

                    {/* LEFT */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        {/* Name */}
                        <div className="mb-6 flex items-center gap-5">
                            <Image
                                src={avatar}
                                alt="Siddhi Singh"
                                width={80}
                                height={80}
                                className="h-12 w-12 rounded-full border object-cover md:h-20 md:w-20"
                            />

                            <div className="flex-1 min-w-0">
                                <h2
                                    className="great-vibes-regular text-xl font-normal md:text-3xl"
                                    style={{ fontFamily: "'Great Vibes', cursive" }}
                                >
                                    Siddhi Singh
                                </h2>

                                <FloatingText
                                    items={["Developer", "Open Source", "Available for Freelance"]}
                                    interval={3000}
                                    className="text-sm text-muted font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Text className="text-muted">
                                I'm a <strong>20yo Developer</strong> balancing a corporate
                                career with my graduation while building modern web experiences
                                and learning something new every day.
                            </Text>

                            <Text className="text-muted">
                                Beyond coding, I'm obsessed with turning everyday experiences
                                into stories people relate to. I write about career, money,
                                wellness, fashion, home and personal growth.
                            </Text>

                            <Text className="text-muted">
                                Here you'll find my blogs, songs, book recommendations and the
                                ideas I'm currently exploring.
                            </Text>

                            <Text className="text-muted">
                                I also design and build modern websites for businesses.
                            </Text>
                        </div>
                    </motion.div>

                    {/* RIGHT: scrapbook collage (exact layout of aprilleihuanani.com) */}
                    <div className="flex justify-center items-center py-6 lg:justify-end">
                        <div className="relative w-full max-w-[520px] aspect-[468/326] select-none">

                            {/* 1. Pink torn paper (bottom) */}
                            <motion.div
                                className="absolute z-[1] left-[35%] top-[12.067%] w-[57.86%]"
                                initial={{ opacity: 0, scale: 0.85, y: 30, rotate: -8 }}
                                whileInView={{ opacity: 1, scale: 1, y: -50, rotate: 20 }}
                                viewport={view}
                                transition={{ ...spring, duration: 0.7, delay: 0.1 }}
                            >
                                <Image
                                    src={pinkPaperImg}
                                    alt="Pink torn paper"
                                    className="w-full h-auto "
                                    priority
                                />
                            </motion.div>

                            {/* 2. Paris stamps paper */}
                            <motion.div
                                className="absolute z-[4] right-[12%] top-[6.135%] w-[97.86%]"
                                initial={{ opacity: 0, scale: 0.85, x: 60, rotate: 8 }}
                                whileInView={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
                                viewport={view}
                                transition={{ ...spring, duration: 0.7, delay: 0.3 }}
                            >
                                <Image
                                    src={parisImg}
                                    alt="Vintage Paris travel stamps"
                                    className="w-full h-auto"
                                    priority
                                />
                            </motion.div>

                            {/* 3. Notebook paper */}
                            <motion.div
                                className="absolute z-[3] left-0 top-0 w-[97.86%]"
                                initial={{ opacity: 0, scale: 0.85, x: -60, rotate: -8 }}
                                whileInView={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
                                viewport={view}
                                transition={{ ...spring, duration: 0.7, delay: 0.5 }}
                            >
                                <Image
                                    src={paperImg}
                                    alt="Notebook paper"
                                    className="w-full h-auto"
                                    priority
                                />
                            </motion.div>

                            {/* 4. Polaroid (thin even border, no thick bottom) */}
                            <motion.div
                                className="absolute z-[4] left-[22.65%] top-[16.87%] w-[43.59%] aspect-square bg-[#f4f4f4] drop-shadow-[1px_6px_6px_rgba(16,16,16,0.22)]"
                                initial={{ opacity: 0, scale: 1.15, y: -60, rotate: 5 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                                viewport={view}
                                transition={{
                                    type: "spring",
                                    stiffness: 90,
                                    damping: 15,
                                    duration: 0.8,
                                    delay: 0.7,
                                }}
                            >
                                <div className="absolute inset-[3.92%] overflow-hidden">
                                    <Image
                                        src={avatarAbout}
                                        alt="Siddhi Singh"
                                        fill
                                        sizes="(max-width: 640px) 45vw, 230px"
                                        className="object-cover object-top"
                                        priority
                                    />
                                </div>
                            </motion.div>

                            {/* 5. Tape (no extra rotation: the image is already diagonal) */}
                            <motion.div
                                className="absolute z-[5] left-[20.91%] top-[60.62%] w-[20.22%] pointer-events-none"
                                initial={{ opacity: 0, scale: 1.25, y: 15 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0, rotate: 70 }}
                                viewport={view}
                                transition={{ duration: 0.4, delay: 1.1, ease: "easeOut" }}
                            >
                                <Image src={tapeImg} alt="Tape" className="w-full h-auto" />
                            </motion.div>

                            <motion.div
                                className="absolute z-[3] left-[35%] bottom-[-25%] w-[57.86%]"
                                initial={{ opacity: 0, scale: 0.85, y: 30, rotate: -8 }}
                                whileInView={{ opacity: 1, scale: 1, y: -50, rotate: -250 }}
                                viewport={view}
                                transition={{ ...spring, duration: 0.7, delay: 0.1 }}
                            >
                                <Image
                                    src={pinkPaperImg}
                                    alt="Pink torn paper"
                                    className="w-full h-auto "
                                    priority
                                />
                            </motion.div>

                            {/* 6. Pin (top right of polaroid) */}
                            <motion.div
                                className="absolute z-[6] left-[58.76%] top-[12.27%] w-[5.56%] pointer-events-none"
                                initial={{ opacity: 0, scale: 0, y: -25 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={view}
                                transition={{
                                    type: "spring",
                                    stiffness: 180,
                                    damping: 12,
                                    duration: 0.5,
                                    delay: 1.3,
                                }}
                            >
                                <Image src={pinImg} alt="Push pin" className="w-full h-auto" />
                            </motion.div>

                        </div>
                    </div>

                </div>
            </Container>
        </Section>
    );
};

export default About;