import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, createUser, deleteUser, queryKeys } from "../api";

export function UserManager() {
  const queryClient = useQueryClient();
  const [newUserName, setNewUserName] = useState("");
  const [showManage, setShowManage] = useState(false);

  const { data: users = [] } = useQuery({
    queryKey: queryKeys.users,
    queryFn: fetchUsers,
  });

  const addMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.beignes });
      queryClient.invalidateQueries({ queryKey: queryKeys.scoreboard });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newUserName.trim()) return;
    addMutation.mutate(newUserName.trim());
    setNewUserName("");
  }

  return (
    <section className="border-t border-slate-800 pt-4 space-y-4">
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          type="text"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          placeholder="Nouveau collègue..."
          className="flex-1 rounded-lg border-2 border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-gray-100 placeholder:text-gray-600 focus:border-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-slate-700 px-5 py-2.5 text-sm font-medium text-gray-200 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
        >
          Ajouter
        </button>
      </form>

      <button
        onClick={() => setShowManage(!showManage)}
        className="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
      >
        {showManage ? "Masquer" : "Gérer les collègues"}
      </button>

      {showManage && (
        <ul className="space-y-1">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between py-2 border-b border-slate-800/50"
            >
              <span className="text-sm">{user.name}</span>
              <button
                onClick={() => deleteMutation.mutate(user.id)}
                className="rounded-md border border-rose-500/60 px-3 py-1 text-xs text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
