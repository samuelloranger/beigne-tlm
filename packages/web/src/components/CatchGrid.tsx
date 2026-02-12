import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, catchUser, queryKeys } from "../api";
import confetti from "canvas-confetti";

function fireConfetti(e: React.MouseEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { x, y },
    colors: ["#f472b6", "#c084fc", "#60a5fa", "#facc15", "#fb923c"],
  });

  setTimeout(() => {
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { x, y },
      colors: ["#f472b6", "#c084fc", "#60a5fa"],
    });
  }, 200);
}

export function CatchGrid() {
  const queryClient = useQueryClient();
  const { data: users = [] } = useQuery({
    queryKey: queryKeys.users,
    queryFn: fetchUsers,
  });

  const catchMutation = useMutation({
    mutationFn: catchUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.beignes });
      queryClient.invalidateQueries({ queryKey: queryKeys.scoreboard });
    },
  });

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">
        Qui a laissé son ordi débarré?
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {users.map((user, i) => (
          <button
            key={user.id}
            onClick={(e) => {
              fireConfetti(e);
              catchMutation.mutate(user.id);
            }}
            className="shake-hover flex flex-col items-center gap-2 rounded-xl border-2 border-slate-700 bg-slate-800/80 backdrop-blur-sm px-4 py-5 transition-all hover:border-rose-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rose-500/20 active:scale-95 cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className="font-semibold text-lg">{user.name}</span>
            <span className="shake-target text-[0.65rem] font-bold tracking-widest text-rose-500">
              ATTRAPÉ!
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
