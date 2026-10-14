import { Button } from "@/components/ui/Button";

type ShareButtonProps = {
  slug: string;
};

export default function ShareButton({ slug }: ShareButtonProps) {
  const handleShare = async () => {
    const url = `${window.location.origin}/products/${slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this product",
          url,
        });
      } catch (error) {
        console.error("Share failed", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("Product link copied to clipboard!");
      } catch (error) {
        console.error("Copy failed", error);
      }
    }
  };

  return (
    <Button onClick={handleShare} variant="secondary" size="md" className="mt-8 ml-4">
      Share
    </Button>
  );
}
