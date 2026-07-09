import { AdSlot } from "@/components/ads/AdSlot";

type NativeBannerSlotProps = {
  slotId: string;
  className?: string;
};

export function NativeBannerSlot({ slotId, className }: NativeBannerSlotProps) {
  return (
    <AdSlot
      slotId={slotId}
      format="native-banner-4x1"
      className={className}
      variants={[
        { width: 640, height: 160, minViewport: 1024 },
        { width: 468, height: 117, minViewport: 640, maxViewport: 1023 },
        { width: 320, height: 80, maxViewport: 639 },
      ]}
      title="Sponsored"
      smartLinkSource={`native-${slotId}`}
    />
  );
}
