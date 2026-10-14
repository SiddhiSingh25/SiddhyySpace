import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  PlaylistShowcaseSkeleton,
  PlaylistGridCardSkeleton,
} from "@/components/feedback/SectionSkeletons";
//commit
export default function PlaylistsLoading() {
  return (
    <Section>
      <Container>
        {/* Page header shimmer */}
        <div className="mb-10 text-center md:text-left space-y-3">
          <Skeleton className="h-10 w-44 rounded-xl" />
          <Skeleton className="h-5 w-80 rounded-lg" />
        </div>

        {/* Showcase shimmer */}
        <div className="my-8">
          <PlaylistShowcaseSkeleton />
        </div>

        {/* Additional playlists grid shimmer */}
        <div className="mt-16 space-y-6">
          <Skeleton className="h-7 w-36 rounded-lg" />
          <div className="grid gap-6 md:grid-cols-2">
            <PlaylistGridCardSkeleton />
            <PlaylistGridCardSkeleton />
          </div>
        </div>
      </Container>
    </Section>
  );
}
