import React from "react";
import Image from "next/image";
import avatar from "@/assets/profile/profile.png";
import avatarAbout from "@/assets/profile/about.jpeg";

import { FloatingText } from "@/components/ui/FloatingText";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";

const About = () => {
    return (
        <Section>
            <Container>
                <div className="grid items-start gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12">

                    {/* LEFT */}
                    <div>
                        {/* Name */}
                        <div className="mb-6 flex items-center gap-4 sm:gap-5">
                            <Image
                                src={avatar}
                                alt="Siddhi Singh"
                                width={80}
                                height={80}
                                className="h-14 w-14 rounded-full border object-cover sm:h-16 sm:w-16 md:h-20 md:w-20"
                            />

                            <div className="flex-1 min-w-0">
                                <h2
                                    className="great-vibes-regular text-2xl font-normal sm:text-3xl md:text-4xl lg:text-5xl"
                                    style={{ fontFamily: "'Great Vibes', cursive" }}
                                >
                                    Siddhi Singh
                                </h2>

                                <FloatingText
                                    items={["Developer", "Open Source", "Available for Freelance"]}
                                    interval={3000}
                                    className="mt-1 text-xs text-muted font-medium sm:text-sm md:text-base"
                                />
                            </div>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
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
                    </div>

                    {/* RIGHT */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
                            <div className="overflow-hidden rounded-2xl sm:rounded-3xl border bg-card p-2.5 sm:p-3 shadow-sm transition-shadow duration-300 hover:shadow-md">
                                <div className="relative h-[300px] xs:h-[360px] sm:h-[420px] md:h-[460px] w-full overflow-hidden rounded-xl sm:rounded-2xl">
                                    <Image
                                        src={avatarAbout}
                                        alt="Siddhi Singh"
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
                                        className="object-cover object-top transition-transform duration-500 hover:scale-105"
                                        priority
                                    />
                                </div>

                                <p className="mt-2.5 text-center text-xs sm:text-sm text-muted">
                                    keep visiting ˚.⋆⟡♡⟡⋆.˚
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </Container>
        </Section>
    );
};

export default About;