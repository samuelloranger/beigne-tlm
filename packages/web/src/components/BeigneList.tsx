import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBeignes,
  updateBeigneCost,
  deleteBeigne,
  queryKeys,
} from "../api";

export function BeigneList() {
  const queryClient = useQueryClient();
  const [editingBeigneId, setEditingBeigneId] = useState<number | null>(null);
  const [costInput, setCostInput] = useState("");
  const [contextMenu, setContextMenu] = useState<{
    beigneId: number;
    x: number;
    y: number;
  } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFired = useRef(false);

  const { data: beignes = [] } = useQuery({
    queryKey: queryKeys.beignes,
    queryFn: fetchBeignes,
  });

  const costMutation = useMutation({
    mutationFn: ({ id, cost }: { id: number; cost: number }) =>
      updateBeigneCost(id, cost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.beignes });
      queryClient.invalidateQueries({ queryKey: queryKeys.scoreboard });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBeigne,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.beignes });
      queryClient.invalidateQueries({ queryKey: queryKeys.scoreboard });
    },
  });

  useEffect(() => {
    function handleClick() {
      setContextMenu(null);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  function clearLongPress() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  function handleTouchStart(e: React.TouchEvent, beigneId: number) {
    longPressFired.current = false;
    const touch = e.touches[0];
    longPressTimer.current = setTimeout(() => {
      longPressFired.current = true;
      setContextMenu({ beigneId, x: touch.clientX, y: touch.clientY });
    }, 500);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    clearLongPress();
    if (longPressFired.current) {
      e.preventDefault();
    }
  }

  function handleSaveCost(beigneId: number) {
    const cost = parseFloat(costInput);
    if (isNaN(cost) || cost < 0) return;
    costMutation.mutate({ id: beigneId, cost });
    setEditingBeigneId(null);
    setCostInput("");
  }

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">
        Beignes à apporter
        <span className="ml-2 text-sm font-normal text-gray-500">
          ({beignes.length})
        </span>
      </h2>
      {beignes.length === 0 ? (
        <p className="text-gray-600 py-12 text-center text-lg">
          Aucune beigne pour l'instant!
        </p>
      ) : (
        <ul className="space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
          {beignes.map((beigne, index) => (
            <li
              key={beigne.id}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({
                  beigneId: beigne.id,
                  x: e.clientX,
                  y: e.clientY,
                });
              }}
              onTouchStart={(e) => handleTouchStart(e, beigne.id)}
              onTouchEnd={handleTouchEnd}
              onTouchMove={clearLongPress}
              onClick={() => {
                if (editingBeigneId === beigne.id) {
                  setEditingBeigneId(null);
                } else {
                  setEditingBeigneId(beigne.id);
                  setCostInput(beigne.cost?.toString() ?? "");
                }
              }}
              className={`rounded-xl border-2 p-4 cursor-pointer transition-all animate-fade-in-up ${
                beigne.cost !== null
                  ? "border-emerald-800/60 opacity-70"
                  : "border-slate-700 hover:border-purple-600"
              } bg-slate-800/80 backdrop-blur-sm`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-center gap-4 flex-wrap">
                <strong className="text-base">{beigne.user.name}</strong>
                <span className="text-sm text-gray-500">
                  {new Date(beigne.caughtAt).toLocaleString("fr-CA")}
                </span>
                {beigne.cost !== null && (
                  <span className="ml-auto rounded-md bg-emerald-800 px-3 py-1 text-sm font-semibold">
                    {beigne.cost.toFixed(2)} $
                  </span>
                )}
              </div>

              {editingBeigneId === beigne.id && (
                <div
                  className="flex gap-2 mt-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={costInput}
                    onChange={(e) => setCostInput(e.target.value)}
                    placeholder="Coût ($)"
                    autoFocus
                    className="flex-1 rounded-md border-2 border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-100 focus:border-slate-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleSaveCost(beigne.id)}
                    className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition-colors cursor-pointer"
                  >
                    Sauvegarder
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {contextMenu && (
        <div
          ref={contextMenuRef}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-50 rounded-lg border border-slate-700 bg-slate-800 py-1 shadow-xl"
        >
          <button
            onClick={() => {
              deleteMutation.mutate(contextMenu.beigneId);
              setContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left text-sm text-rose-400 hover:bg-slate-700 cursor-pointer"
          >
            Supprimer cette beigne
          </button>
        </div>
      )}
    </section>
  );
}
