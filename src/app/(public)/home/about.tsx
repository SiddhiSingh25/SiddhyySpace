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
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

                    {/* LEFT */}
                    <div>
                        <Heading as="h2" className="mb-8">
                            About
                        </Heading>

                        {/* Name */}
                        <div className="mb-10 flex items-center gap-5">
                            <Image
                                src={avatar}
                                alt="Siddhi Singh"
                                width={80}
                                height={80}
                                className="h-16 w-16 rounded-full border object-cover md:h-20 md:w-20"
                            />

                            <div>
                                <h2 className="text-3xl font-bold md:text-4xl">
                                    Siddhi Singh
                                </h2>

                                <FloatingText className="mt-2 text-sm text-muted md:text-base">
                                    Developer • Open Source • Available for Freelance
                                </FloatingText>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <Text className="leading-8 text-muted">
                                I'm a <strong>20yo Developer</strong> balancing a corporate
                                career with my graduation while building modern web experiences
                                and learning something new every day.
                            </Text>

                            <Text className="leading-8 text-muted">
                                Beyond coding, I'm obsessed with turning everyday experiences
                                into stories people relate to. I write about career, money,
                                wellness, fashion, home and personal growth.
                            </Text>

                            <Text className="leading-8 text-muted">
                                Here you'll find my blogs, songs, book recommendations and the
                                ideas I'm currently exploring.
                            </Text>

                            <Text className="leading-8 text-muted">
                                I also design and build modern websites for businesses.
                            </Text>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
                            <div className="overflow-hidden rounded-3xl border bg-card p-3 shadow-sm transition-shadow duration-300 hover:shadow-md">
                                <div className="relative h-[380px] w-full overflow-hidden rounded-2xl sm:h-[440px] lg:h-[480px]">
                                    <Image
                                        src={avatarAbout}
                                        alt="Siddhi Singh"
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
                                        className="object-cover object-center transition-transform duration-500 hover:scale-105"
                                        priority
                                    />
                                </div>

                                <p className="mt-3 text-center text-sm text-muted">
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