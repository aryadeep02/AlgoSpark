
import { Trophy, Clock, ArrowUpDownIcon as ArrowsUpDown, Search } from "lucide-react"

interface Algorithm {
  name: string
  progress: number
  comparisons: number
  swaps: number
  timeElapsed: number
  completed: boolean
}

interface RaceLeaderboardProps {
  algorithms: Algorithm[]
  type: "sorting" | "searching"
}

export default function RaceLeaderboard({ algorithms, type }: RaceLeaderboardProps) {
  // Sort algorithms by completion status and time
  const sortedAlgorithms = [...algorithms].sort((a, b) => {
    // First sort by completion status
    if (a.completed && !b.completed) return -1
    if (!a.completed && b.completed) return 1

    // Then sort by time elapsed (for completed algorithms)
    if (a.completed && b.completed) {
      return a.timeElapsed - b.timeElapsed
    }

    // Then sort by progress (for incomplete algorithms)
    return b.progress - a.progress
  })

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
          Race Leaderboard
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800">
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">Rank</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">Algorithm</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Time
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                <div className="flex items-center">
                  {type === "sorting" ? <ArrowsUpDown className="h-4 w-4 mr-1" /> : <Search className="h-4 w-4 mr-1" />}
                  {type === "sorting" ? "Swaps" : "Operations"}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                Comparisons
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAlgorithms.map((algo, index) => (
              <tr
                key={algo.name}
                className={`border-t border-slate-200 dark:border-slate-800 ${index === 0 && algo.completed ? "bg-green-50 dark:bg-green-900/20" : ""}`}
              >
                <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                  {index === 0 && algo.completed ? (
                    <span className="flex items-center font-bold text-yellow-600 dark:text-yellow-500">
                      <Trophy className="h-4 w-4 mr-1" />
                      1st
                    </span>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{algo.name}</td>
                <td className="px-4 py-3 text-sm">
                  {algo.completed ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                      {Math.round(algo.progress)}% Done
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-slate-900 dark:text-white font-mono">
                  {(algo.timeElapsed / 1000).toFixed(2)}s
                </td>
                <td className="px-4 py-3 text-sm text-slate-900 dark:text-white font-mono">
                  {type === "sorting" ? algo.swaps : algo.comparisons}
                </td>
                <td className="px-4 py-3 text-sm text-slate-900 dark:text-white font-mono">{algo.comparisons}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

