import {Link} from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BarChart3, GitBranch, Network, Search, Sigma, Workflow } from "lucide-react"

export default function AlgorithmCategories() {
  const categories = [
    {
      title: "Sorting Algorithms",
      description: "Visualize and compare different sorting techniques",
      icon: <BarChart3 className="h-6 w-6 text-purple-500" />,
      link: "/algorithms/sorting",
      algorithms: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort", "Quick Sort"],
      status: "implemented",
    },
    {
      title: "Searching Algorithms",
      description: "Explore efficient ways to find elements in data structures",
      icon: <Search className="h-6 w-6 text-blue-500" />,
      link: "/algorithms/searching",
      algorithms: ["Linear Search", "Binary Search"],
      status: "implemented",
    },
    {
      title: "Graph Algorithms",
      description: "Visualize traversal and pathfinding techniques",
      icon: <Network className="h-6 w-6 text-green-500" />,
      link: "/algorithms/graph",
      algorithms: ["BFS", "DFS", "Dijkstra's", "Prim's", "Kruskal's"],
      status: "coming-soon",
    },
    {
      title: "Dynamic Programming",
      description: "Understand optimization through subproblem solutions",
      icon: <GitBranch className="h-6 w-6 text-yellow-500" />,
      link: "/algorithms/dp",
      algorithms: ["Fibonacci", "Knapsack", "LCS", "LIS"],
      status: "coming-soon",
    },
    {
      title: "Greedy Algorithms",
      description: "Learn optimal local choices for global solutions",
      icon: <Workflow className="h-6 w-6 text-red-500" />,
      link: "/algorithms/greedy",
      algorithms: ["Activity Selection", "Huffman Coding"],
      status: "coming-soon",
    },
    {
      title: "Mathematical Algorithms",
      description: "Explore fundamental mathematical computations",
      icon: <Sigma className="h-6 w-6 text-pink-500" />,
      link: "/algorithms/math",
      algorithms: ["GCD (Euclidean)", "Sieve of Eratosthenes", "Prime Factorization"],
      status: "coming-soon",
    },
  ]

  return (
    <div id="algorithms" className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Algorithm Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <Card
            key={index}
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 overflow-hidden"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                {category.icon}
                {category.status === "implemented" ? (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">Implemented</Badge>
                ) : (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                    Coming Soon
                  </Badge>
                )}
              </div>
              <CardTitle className="text-slate-900 dark:text-white text-xl">{category.title}</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">{category.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-2">
                {category.algorithms.map((algo, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    {algo}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              {category.status === "implemented" ? (
                <Link
                  to={category.link}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center text-sm font-medium"
                >
                  Explore {category.title} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              ) : (
                <span className="text-slate-500 dark:text-slate-500 text-sm">Coming soon...</span>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

