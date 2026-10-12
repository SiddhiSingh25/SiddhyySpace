import { Skeleton } from "@/components/ui/Skeleton";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export function BlogCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-sm">
      <Skeleton className="h-6 w-3/4 rounded-md" />
      <Skeleton className="mt-3 h-4 w-full rounded-md" />
      <Skeleton className="mt-2 h-4 w-4/5 rounded-md" />
      <div className="mt-6 flex items-center justify-between">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-4 w-16 rounded-md" />
      </div>
    </div>
  );
}

export function BookCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-sm">
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <Skeleton className="mt-3 h-4 w-4/5 rounded-md" />
      <Skeleton className="mt-2 h-3 w-1/2 rounded-md" />
    </div>
  );
}

export function PlaylistShowcaseSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ffffff] via-[#f7f9fd] to-[#e4ebfc] p-6 sm:p-10 md:p-14 border border-[#d3defa] shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Card left */}
          <div className="lg:col-span-7 flex justify-center py-6">
            <div className="relative max-w-sm sm:max-w-md w-full">
              {/* CD shimmer */}
              <Skeleton className="absolute -top-12 -left-6 z-20 h-24 w-24 rounded-full" />
              {/* Main Spotify card shimmer */}
              <div className="rounded-3xl bg-zinc-900/90 p-6 shadow-2xl border border-white/10">
                <Skeleton className="aspect-square w-full rounded-2xl bg-zinc-800" />
                <div className="mt-5 flex items-center justify-between">
                  <div className="space-y-2 w-2/3">
                    <Skeleton className="h-5 w-3/4 bg-zinc-800" />
                    <Skeleton className="h-3 w-1/2 bg-zinc-800" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full bg-zinc-800" />
                </div>
              </div>
            </div>
          </div>
          {/* Text right */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-4">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-10 w-4/5 rounded-lg" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="mt-4 h-12 w-40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CelebrationSkeleton() {
  return (
    <div className="space-y-6 border-l border-border pl-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="relative space-y-2">
          <span className="absolute -left-[1.91rem] top-1.5 h-3 w-3 rounded-full bg-slate-300 ring-4 ring-background" />
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-6 w-1/2 rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
      ))}
    </div>
  );
}

export function WallOfLoveSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="relative rounded-3xl p-6 border border-purple-500/20 bg-gradient-to-b from-[#1c0c35] to-[#120724] space-y-4 shadow-lg min-h-[220px]"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-5 rounded-full bg-purple-900/50" />
            <Skeleton className="h-5 w-20 rounded-full bg-purple-900/50" />
          </div>
          <Skeleton className="h-4 w-full bg-purple-900/40" />
          <Skeleton className="h-4 w-4/5 bg-purple-900/40" />
          <Skeleton className="h-4 w-2/3 bg-purple-900/40" />
          <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-7 rounded-full bg-purple-900/60" />
              <Skeleton className="h-4 w-16 bg-purple-900/40" />
            </div>
            <Skeleton className="h-4 w-12 bg-purple-900/40" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HomeSectionsSkeleton() {
  return (
    <div className="space-y-16 py-12">
      {/* Featured Writing Shimmer */}
      <Section className="bg-surface/40">
        <Container>
          <div className="mb-8 flex justify-between">
            <Skeleton className="h-8 w-44 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <BlogCardSkeleton />
            <BlogCardSkeleton />
          </div>
        </Container>
      </Section>

      {/* Books Shimmer */}
      <Section>
        <Container>
          <div className="mb-8 flex justify-between">
            <Skeleton className="h-8 w-56 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <BookCardSkeleton />
            <BookCardSkeleton />
            <BookCardSkeleton />
            <BookCardSkeleton />
          </div>
        </Container>
      </Section>

      {/* Playlist Shimmer */}
      <Section className="py-12">
        <Container>
          <div className="mb-6 flex justify-between">
            <Skeleton className="h-8 w-36 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
          <PlaylistShowcaseSkeleton />
        </Container>
      </Section>
    </div>
  );
}
