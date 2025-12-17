interface UnreadBadgeProps {
  count: number;
}

export default function UnreadBadge({ count }: UnreadBadgeProps) {
  if (count === 0) return null;

  return (
    <div className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-semibold rounded-full">
      {count > 99 ? '99+' : count}
    </div>
  );
}
