// "use client";

// import React from "react";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import avatar from "@/assets/profile/profile.png";
// import avatarAbout from "@/assets/profile/about.jpeg";

// import paperImg from "@/assets/aboutDecor/paper.webp";
// import pinkPaperImg from "@/assets/aboutDecor/pinkPaperPiece.webp";
// import parisImg from "@/assets/aboutDecor/paris.webp";
// import pinImg from "@/assets/aboutDecor/ping.webp";
// import tapeImg from "@/assets/aboutDecor/tape.webp";

// import { FloatingText } from "@/components/ui/FloatingText";
// import { Container } from "@/components/layout/Container";
// import { Section } from "@/components/layout/Section";
// import { Text } from "@/components/typography/Text";

// const About = () => {
//     return (
//         <Section>
//             <Container>
//                 <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-8">

//                     {/* LEFT */}
//                     <motion.div
//                         initial={{ opacity: 0, x: -30 }}
//                         whileInView={{ opacity: 1, x: 0 }}
//                         viewport={{ once: true, margin: "-50px" }}
//                         transition={{ duration: 0.6, ease: "easeOut" }}
//                     >
//                         {/* Name */}
//                         <div className="mb-6 flex items-center gap-5">
//                             <Image
//                                 src={avatar}
//                                 alt="Siddhi Singh"
//                                 width={80}
//                                 height={80}
//                                 className="h-12 w-12 rounded-full border object-cover md:h-20 md:w-20"
//                             />

//                             <div className="flex-1 min-w-0">
//                                 <h2
//                                     className="great-vibes-regular text-xl font-normal md:text-3xl"
//                                     style={{ fontFamily: "'Great Vibes', cursive" }}
//                                 >
//                                     Siddhi Singh
//                                 </h2>

//                                 <FloatingText
//                                     items={["Developer", "Open Source", "Available for Freelance"]}
//                                     interval={3000}
//                                     className="text-sm text-muted font-medium"
//                                 />
//                             </div>
//                         </div>

//                         <div className="space-y-4">
//                             <Text className="text-muted">
//                                 I'm a <strong>20yo Developer</strong> balancing a corporate
//                                 career with my graduation while building modern web experiences
//                                 and learning something new every day.
//                             </Text>

//                             <Text className="text-muted">
//                                 Beyond coding, I'm obsessed with turning everyday experiences
//                                 into stories people relate to. I write about career, money,
//                                 wellness, fashion, home and personal growth.
//                             </Text>

//                             <Text className="text-muted">
//                                 Here you'll find my blogs, songs, book recommendations and the
//                                 ideas I'm currently exploring.
//                             </Text>

//                             <Text className="text-muted">
//                                 I also design and build modern websites for businesses.
//                             </Text>
//                         </div>
//                     </motion.div>

//                     {/* RIGHT: Aesthetic Scrapbook Photo Collage with sequential assembly animation */}
//                     {/* <div className="flex justify-center items-center py-6 lg:justify-end">
//                         <div className="relative w-full max-w-[420px] sm:max-w-[480px] md:max-w-[500px] aspect-[4/3] flex items-center justify-center select-none">


//                             <motion.div
//                                 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[82%] sm:w-[86%] z-0"
//                                 initial={{ opacity: 0, scale: 0.7, y: -40, rotate: -15 }}
//                                 whileInView={{ opacity: 1, scale: 1, y: 0, rotate: -3 }}
//                                 whileHover={{ rotate: -1, scale: 1.01 }}
//                                 viewport={{ once: true, margin: "-50px" }}
//                                 transition={{
//                                     duration: 0.7,
//                                     delay: 0.1,
//                                     type: "spring",
//                                     stiffness: 70,
//                                     damping: 14
//                                 }}
//                             >
//                                 <Image
//                                     src={pinkPaperImg}
//                                     alt="Pink paper decor background"
//                                     className="w-full h-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]"
//                                     priority
//                                 />
//                             </motion.div>


//                             <motion.div
//                                 className="absolute -left-3 sm:-left-6 top-3 sm:top-5 w-[56%] sm:w-[60%] z-10"
//                                 initial={{ opacity: 0, scale: 0.6, x: -70, y: -30, rotate: -35 }}
//                                 whileInView={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: -14 }}
//                                 whileHover={{ rotate: -16, scale: 1.02 }}
//                                 viewport={{ once: true, margin: "-50px" }}
//                                 transition={{
//                                     duration: 0.7,
//                                     delay: 0.3,
//                                     type: "spring",
//                                     stiffness: 70,
//                                     damping: 14
//                                 }}
//                             >
//                                 <Image
//                                     src={paperImg}
//                                     alt="Notebook paper decor"
//                                     className="w-full h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)]"
//                                     priority
//                                 />
//                             </motion.div>


//                             <motion.div
//                                 className="absolute -right-2 sm:-right-5 top-2 sm:top-4 w-[50%] sm:w-[54%] z-10"
//                                 initial={{ opacity: 0, scale: 0.6, x: 70, y: 30, rotate: 40 }}
//                                 whileInView={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 18 }}
//                                 whileHover={{ rotate: 20, scale: 1.02 }}
//                                 viewport={{ once: true, margin: "-50px" }}
//                                 transition={{
//                                     duration: 0.7,
//                                     delay: 0.5,
//                                     type: "spring",
//                                     stiffness: 70,
//                                     damping: 14
//                                 }}
//                             >
//                                 <Image
//                                     src={parisImg}
//                                     alt="Paris postage stamp decor"
//                                     className="w-full h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)]"
//                                     priority
//                                 />
//                             </motion.div>

//                             <motion.div
//                                 className="relative z-20 w-[60%] sm:w-[63%] bg-white p-3 sm:p-4 pb-12 sm:pb-16 rounded-[2px] shadow-[0_20px_45px_rgba(0,0,0,0.38)]"
//                                 initial={{ opacity: 0, scale: 1.2, y: -70, rotate: 6 }}
//                                 whileInView={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
//                                 whileHover={{ scale: 1.03, rotate: -1 }}
//                                 viewport={{ once: true, margin: "-50px" }}
//                                 transition={{
//                                     duration: 0.8,
//                                     delay: 0.7,
//                                     type: "spring",
//                                     stiffness: 90,
//                                     damping: 15
//                                 }}
//                             >
//                                 <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 rounded-[1px]">
//                                     <Image
//                                         src={avatarAbout}
//                                         alt="Siddhi Singh"
//                                         fill
//                                         sizes="(max-width: 640px) 70vw, 350px"
//                                         className="object-cover object-top"
//                                         priority
//                                     />
//                                 </div>

//                                 <motion.div
//                                     className="absolute -top-3 sm:-top-4 -right-2 sm:-right-3 w-9 sm:w-12 z-30 drop-shadow-[2px_6px_8px_rgba(0,0,0,0.45)] pointer-events-none"
//                                     initial={{ opacity: 0, scale: 0, y: -25, rotate: -45 }}
//                                     whileInView={{ opacity: 1, scale: 1, y: 0, rotate: 12 }}
//                                     viewport={{ once: true, margin: "-50px" }}
//                                     transition={{
//                                         duration: 0.5,
//                                         delay: 1.0,
//                                         type: "spring",
//                                         stiffness: 180,
//                                         damping: 12
//                                     }}
//                                 >
//                                     <Image
//                                         src={pinImg}
//                                         alt="Push pin decor"
//                                         className="w-full h-auto object-contain"
//                                     />
//                                 </motion.div>
//                             </motion.div>

//                             <motion.div
//                                 className="absolute -bottom-3 sm:-bottom-4 left-1 sm:left-3 w-24 sm:w-32 z-30 drop-shadow-[1px_2px_4px_rgba(0,0,0,0.3)] pointer-events-none"
//                                 initial={{ opacity: 0, scale: 1.3, y: 15, rotate: -32 }}
//                                 whileInView={{ opacity: 0.95, scale: 1, y: 0, rotate: -32 }}
//                                 viewport={{ once: true, margin: "-50px" }}
//                                 transition={{
//                                     duration: 0.4,
//                                     delay: 1.15,
//                                     ease: "easeOut"
//                                 }}
//                             >
//                                 <Image
//                                     src={tapeImg}
//                                     alt="Tape decor"
//                                     className="w-full h-auto object-contain"
//                                 />
//                             </motion.div>

//                         </div>
//                     </div> */}

//                     {/* RIGHT: Scrapbook collage (matches aprilleihuanani.com layout) */}
//                     <div className="flex justify-center items-center py-6 lg:justify-end">
//                         {/* Remove bg/rounded/p if you want to keep your light background */}
//                         <div className="rounded-2xl  p-6 sm:p-8 w-full max-w-[560px]">
//                             <div className="relative w-full aspect-[3/2] select-none">

//                                 {/* 1. Pink torn paper (bottom layer) */}
//                                 <motion.div
//                                     className="absolute left-0 top-[33%] w-[80%] z-[1]"
//                                     initial={{ opacity: 0, scale: 0.8, y: 30, rotate: -10 }}
//                                     whileInView={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
//                                     viewport={{ once: true, margin: "-50px" }}
//                                     transition={{ duration: 0.7, delay: 0.1, type: "spring", stiffness: 70, damping: 14 }}
//                                 >
//                                     <Image src={pinkPaperImg} alt="Pink paper" className="w-full h-auto" priority />
//                                 </motion.div>

//                                 {/* 2. Paris stamp paper (right) */}
//                                 <motion.div
//                                     className="absolute left-[42%] top-[2%] w-[58%] z-[2]"
//                                     initial={{ opacity: 0, scale: 0.8, x: 60, rotate: 15 }}
//                                     whileInView={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
//                                     viewport={{ once: true, margin: "-50px" }}
//                                     transition={{ duration: 0.7, delay: 0.3, type: "spring", stiffness: 70, damping: 14 }}
//                                 >
//                                     <Image src={parisImg} alt="Paris stamps" className="w-full h-auto" priority />
//                                 </motion.div>

//                                 {/* 3. Notebook paper (left) */}
//                                 <motion.div
//                                     className="absolute left-[6.5%] top-0 w-[45%] z-[3]"
//                                     initial={{ opacity: 0, scale: 0.8, x: -60, rotate: -25 }}
//                                     whileInView={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
//                                     viewport={{ once: true, margin: "-50px" }}
//                                     transition={{ duration: 0.7, delay: 0.5, type: "spring", stiffness: 70, damping: 14 }}
//                                 >
//                                     <Image src={paperImg} alt="Notebook paper" className="w-full h-auto" priority />
//                                 </motion.div>

//                                 {/* 4. Polaroid: thin, even border */}
//                                 <motion.div
//                                     className="absolute left-[22%] top-[10%] w-[46%] aspect-square z-[4] bg-[#f4f4f4] p-[3.5%] drop-shadow-[1px_6px_6px_rgba(16,16,16,0.25)]"
//                                     initial={{ opacity: 0, scale: 1.2, y: -60, rotate: 6 }}
//                                     whileInView={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
//                                     viewport={{ once: true, margin: "-50px" }}
//                                     transition={{ duration: 0.8, delay: 0.7, type: "spring", stiffness: 90, damping: 15 }}
//                                 >
//                                     <div className="relative w-full h-full overflow-hidden">
//                                         <Image
//                                             src={avatarAbout}
//                                             alt="Siddhi Singh"
//                                             fill
//                                             sizes="(max-width: 640px) 45vw, 260px"
//                                             className="object-cover object-top"
//                                             priority
//                                         />
//                                     </div>
//                                 </motion.div>

//                                 {/* 5. Tape: bottom-left, overlapping notebook corner */}
//                                 <motion.div
//                                     className="absolute left-[7%] top-[79%] w-[18%] z-[5] -rotate-[35deg] pointer-events-none"
//                                     initial={{ opacity: 0, scale: 1.3, y: 15 }}
//                                     whileInView={{ opacity: 0.95, scale: 1, y: 0 }}
//                                     viewport={{ once: true, margin: "-50px" }}
//                                     transition={{ duration: 0.4, delay: 1.1, ease: "easeOut" }}
//                                 >
//                                     <Image src={tapeImg} alt="Tape" className="w-full h-auto" />
//                                 </motion.div>

//                                 {/* 6. Pin: attached to the collage, top right of the polaroid */}
//                                 <motion.div
//                                     className="absolute left-[60%] top-[4%] w-[6%] z-[6] pointer-events-none drop-shadow-[1px_4px_4px_rgba(0,0,0,0.4)]"
//                                     initial={{ opacity: 0, scale: 0, y: -25 }}
//                                     whileInView={{ opacity: 1, scale: 1, y: 0 }}
//                                     viewport={{ once: true, margin: "-50px" }}
//                                     transition={{ duration: 0.5, delay: 1.3, type: "spring", stiffness: 180, damping: 12 }}
//                                 >
//                                     <Image src={pinImg} alt="Push pin" className="w-full h-auto" />
//                                 </motion.div>

//                             </div>
//                         </div>
//                     </div>

//                 </div>
//             </Container>
//         </Section>
//     );
// };

// export default About;

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

/**
 * Collage geometry copied from aprilleihuanani.com.
 * Design stage = 468 x 326 units (her layers are 458x305, offset by 10px).
 *
 *  layer        left   top    width
 *  pink paper   10     10     458
 *  stamps       0      20     458
 *  notebook     0      0      458
 *  polaroid     106    55     204 x 204
 *  tape         37     240    104
 *  pin          275    40     26
 */
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
                                className="absolute z-[1] left-[2.137%] top-[3.067%] w-[97.86%]"
                                initial={{ opacity: 0, scale: 0.85, y: 30, rotate: -8 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                                viewport={view}
                                transition={{ ...spring, duration: 0.7, delay: 0.1 }}
                            >
                                <Image
                                    src={pinkPaperImg}
                                    alt="Pink torn paper"
                                    className="w-full h-auto"
                                    priority
                                />
                            </motion.div>

                            {/* 2. Paris stamps paper */}
                            <motion.div
                                className="absolute z-[2] left-0 top-[6.135%] w-[97.86%]"
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
                                className="absolute z-[5] left-[7.91%] top-[73.62%] w-[22.22%] pointer-events-none"
                                initial={{ opacity: 0, scale: 1.25, y: 15 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={view}
                                transition={{ duration: 0.4, delay: 1.1, ease: "easeOut" }}
                            >
                                <Image src={tapeImg} alt="Tape" className="w-full h-auto" />
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