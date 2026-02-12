import { CatchGrid } from "./components/CatchGrid";
import { UserManager } from "./components/UserManager";
import { Scoreboard } from "./components/Scoreboard";
import { BeigneList } from "./components/BeigneList";
import { FloatingEmojis } from "./components/FloatingEmojis";

export function App() {
  return (
    <div className="min-h-screen bg-fun text-gray-100 relative overflow-hidden">
      <FloatingEmojis />

      {/* Content */}
      <div className="relative z-10">
        <header className="text-center py-8 border-b border-slate-800/50">
          <h1 className="text-5xl font-bold">
            🍩 <span className="text-gradient">Beigne</span>
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Le tracker officiel de beignage au bureau
          </p>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2 space-y-6">
            <CatchGrid />
            <UserManager />
            <Scoreboard />
          </div>

          <div className="w-full lg:w-1/2">
            <BeigneList />
          </div>
        </div>
      </div>
    </div>
  );
}
