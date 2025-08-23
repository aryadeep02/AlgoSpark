import {Link} from 'react-router'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Box,
  Database,
  Layers,
  ListTree,
  GitGraph,
  Hash,
  Grid3X3,
  BinaryIcon as BinaryTree,
} from "lucide-react"

export default function DataStructureCategories() {
  const categories = [
    {
      title: "Arrays",
      description: "Explore the fundamental sequential data structure",
      icon: <Box className="h-6 w-6 text-purple-500" />,
      link: "/data-structures/arrays",
      status: "implemented",
    },
    {
      title: "Stacks",
      description: "Understand the Last In First Out (LIFO) principle",
      icon: <Layers className="h-6 w-6 text-blue-500" />,
      link: "/data-structures/stacks",
      status: "implemented",
    },
    {
      title: "Queues",
      description: "Learn about First In First Out (FIFO) operations",
      icon: <Database className="h-6 w-6 text-green-500" />,
      link: "/data-structures/queues",
      status: "implemented",
    },
    {
      title: "Linked Lists",
      description: "Visualize nodes connected via references",
      icon: <ListTree className="h-6 w-6 text-yellow-500" />,
      link: "/data-structures/linked-lists",
      status: "implemented",
    },
    {
      title: "Trees",
      description: "Explore hierarchical node-based structures",
      icon: <BinaryTree className="h-6 w-6 text-red-500" />,
      link: "/data-structures/trees",
      status: "coming-soon",
    },
    {
      title: "Graphs",
      description: "Understand networks of nodes and edges",
      icon: <GitGraph className="h-6 w-6 text-pink-500" />,
      link: "/data-structures/graphs",
      status: "coming-soon",
    },
    {
      title: "Hash Tables",
      description: "Learn key-value mappings with efficient lookups",
      icon: <Hash className="h-6 w-6 text-indigo-500" />,
      link: "/data-structures/hash-tables",
      status: "coming-soon",
    },
    {
      title: "Heaps",
      description: "Visualize specialized tree-based priority structures",
      icon: <Grid3X3 className="h-6 w-6 text-orange-500" />,
      link: "/data-structures/heaps",
      status: "coming-soon",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Data Structure Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

