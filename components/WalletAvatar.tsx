"use client";

interface WalletAvatarProps {
  address: string;
  size?: number;
}

export default function WalletAvatar({ address, size = 40 }: WalletAvatarProps) {
  const addr = address.toLowerCase();
  const colors = [
    `#${addr.slice(2, 8)}`,
    `#${addr.slice(8, 14)}`,
    `#${addr.slice(14, 20)}`,
  ];

  return (
    <div
      className="rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
        boxShadow: `0 0 20px ${colors[0]}40`,
      }}
    />
  );
}
