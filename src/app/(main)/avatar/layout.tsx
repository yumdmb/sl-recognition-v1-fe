import { HandDetectionProvider } from "@/context/HandDetectionContext";

export default function AvatarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HandDetectionProvider>
      {children}
    </HandDetectionProvider>
  );
}
