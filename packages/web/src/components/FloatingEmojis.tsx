const emojiPool = ["🍩", "🧁", "🎉", "🎊", "🥐", "🥯"];

function buildFloatingEmojis(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    emoji: emojiPool[Math.floor(Math.random() * emojiPool.length)],
    left: `${Math.round((i / count) * 96 + Math.random() * 4)}%`,
    duration: `${15 + Math.random() * 10}s`,
    delay: `${Math.random() * 12}s`,
    direction: Math.random() < 0.5 ? "cw" : "ccw",
  }));
}

const items = buildFloatingEmojis(17);

export function FloatingEmojis() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {items.map((item, i) => (
        <span
          key={i}
          className={`absolute bottom-0 text-4xl opacity-0 animate-float-up-${item.direction}`}
          style={{
            left: item.left,
            ["--float-duration" as string]: item.duration,
            ["--float-delay" as string]: item.delay,
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
}
