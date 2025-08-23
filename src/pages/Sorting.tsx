import AlgorithmDetail from "../algorithm-detail"
import { sortingAlgorithms } from "@/lib/sorting-algorithms"

const SortingAlgorithmsPage = ()=> {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-black dark:to-black py-8 mt-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center">
          Sorting Algorithms
        </h1>

        <div className="grid grid-cols-1 gap-8">
          {Object.entries(sortingAlgorithms).map(([key, algorithm]) => (
            <AlgorithmDetail key={key} algorithm={algorithm} type="sorting" algorithmKey={key} />
          ))}
        </div>
      </div>
    </div>
  )
}
export default SortingAlgorithmsPage;
