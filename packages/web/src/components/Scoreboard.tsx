import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { fetchScoreboard, queryKeys, type ScoreboardEntry } from "../api";

const columnHelper = createColumnHelper<ScoreboardEntry>();

const columns = [
  columnHelper.display({
    id: "rank",
    header: "#",
    cell: ({ row }) => {
      const i = row.index;
      return i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1;
    },
    enableSorting: false,
  }),
  columnHelper.accessor("name", {
    header: "Nom",
  }),
  columnHelper.accessor("timesCaught", {
    header: "Fois",
  }),
  columnHelper.accessor("totalSpent", {
    header: "Total $",
    cell: ({ getValue }) => `${getValue().toFixed(2)} $`,
  }),
];

export function Scoreboard() {
  const { data: scoreboard = [] } = useQuery({
    queryKey: queryKeys.scoreboard,
    queryFn: fetchScoreboard,
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: "timesCaught", desc: true },
  ]);

  const table = useReactTable({
    data: scoreboard,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <section className="border-t border-slate-800 pt-4">
      <h2 className="text-lg font-semibold mb-4">Tableau des scores</h2>
      {scoreboard.length === 0 ? (
        <p className="text-gray-600 text-sm">
          Personne n'a été attrapé encore!
        </p>
      ) : (
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b-2 border-slate-700">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={`py-2 px-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${
                      header.column.getCanSort()
                        ? "cursor-pointer select-none hover:text-gray-300 transition-colors"
                        : ""
                    }`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {{
                      asc: " ↑",
                      desc: " ↓",
                    }[header.column.getIsSorted() as string] ?? ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                className="border-b border-slate-800 hover:bg-slate-800/60 transition-colors animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`py-2 px-2 text-sm ${
                      cell.column.id === "rank" ? "text-center text-lg" : ""
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
