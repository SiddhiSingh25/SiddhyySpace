import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Sign in",
};

type Props = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const session = await auth();
  const params = await searchParams;
  if (session?.user) {
    redirect(params.callbackUrl || "/");
  }

  return (
    <Section>
      <Container className="max-w-md">
        <Heading as="h1">Welcome back</Heading>
        <Text muted className="mt-3">
          Sign in with Google to like, save, and comment.
        </Text>
        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signIn("google", {
              redirectTo: params.callbackUrl || "/",
            });
          }}
        >
          <Button type="submit" fullWidth size="lg">
            Continue with Google
          </Button>
        </form>
      </Container>
    </Section>
  );
}
