
import { useEffect, useRef, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, BarChart3, Search, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AlgorithmVisualizerProps {
  algorithm: {
    name: string
    description: string
    timeComplexity: {
      best: string
      average: string
      worst: string
    }
    spaceComplexity: string
  }
  array: number[]
  state: {
    progress: number
    comparisons: number
    swaps: number
    currentArray: number[]
    currentIndices: number[]
    completed: boolean
    timeElapsed: number
  }
  type: "sorting" | "searching"
  searchTarget: number | null
}

export default function AlgorithmVisualizer({ algorithm, array, state, type, searchTarget }: AlgorithmVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationFrame, setAnimationFrame] = useState<number | null>(null)

  // Draw the visualization on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const currentArray = state.currentArray || array
    const currentIndices = state.currentIndices || []

    if (type === "sorting") {
      // Draw sorting visualization
      const barWidth = canvas.width / currentArray.length
      const maxValue = Math.max(...currentArray)

      currentArray.forEach((value, index) => {
        const barHeight = (value / maxValue) * (canvas.height - 20)
        const x = index * barWidth
        const y = canvas.height - barHeight

        // Determine bar color
        let color = "rgb(124, 58, 237)" // Default purple

        if (state.completed) {
          color = "rgb(16, 185, 129)" // Green when completed
        } else if (currentIndices.includes(index)) {
          color = "rgb(239, 68, 68)" // Red for current indices
        }

        // Draw bar
        ctx.fillStyle = color
        ctx.fillRect(x, y, barWidth - 1, barHeight)

        // Draw value on top of bar if there's enough space
        if (barWidth > 20 && barHeight > 15) {
          ctx.fillStyle = document.documentElement.classList.contains("dark") ? "white" : "black"
          ctx.font = "10px Arial"
          ctx.textAlign = "center"
          ctx.fillText(value.toString(), x + barWidth / 2, y + 12)
        }
      })
    } else if (type === "searching") {
      // Draw searching visualization
      const boxSize = Math.min(50, canvas.width / currentArray.length)
      const boxesPerRow = Math.floor(canvas.width / boxSize)

      currentArray.forEach((value, index) => {
        const row = Math.floor(index / boxesPerRow)
        const col = index % boxesPerRow

        const x = col * boxSize
        const y = row * boxSize

        // Determine box color
        let color = "rgb(59, 130, 246)" // Default blue

        if (state.completed && currentIndices.includes(index)) {
          color = "rgb(16, 185, 129)" // Green when found
        } else if (currentIndices.includes(index)) {
          color = "rgb(239, 68, 68)" // Red for current indices
        } else if (value === searchTarget) {
          color = "rgb(245, 158, 11)" // Yellow for target
        }

        // Draw box
        ctx.fillStyle = color
        ctx.fillRect(x, y, boxSize - 2, boxSize - 2)

        // Draw value in box
        ctx.fillStyle = document.documentElement.classList.contains("dark") ? "white" : "black"
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.fillText(value.toString(), x + boxSize / 2, y + boxSize / 2 + 4)
      })

      // If binary search, draw dividers to show how the array is being divided
      if (algorithm.name === "Binary Search" && currentIndices.length > 0) {
        const left = currentIndices[0]
        const right = currentIndices[currentIndices.length - 1]
        const mid = currentIndices[Math.floor(currentIndices.length / 2)]

        if (left !== undefined && right !== undefined) {
          // Draw range indicators
          ctx.strokeStyle = "rgba(245, 158, 11, 0.7)" // Yellow
          ctx.lineWidth = 2

          const leftX = (left % boxesPerRow) * boxSize
          const leftY = Math.floor(left / boxesPerRow) * boxSize
          const rightX = ((right % boxesPerRow) + 1) * boxSize
          

          // Draw range rectangle
          ctx.strokeRect(leftX, leftY, rightX - leftX, boxSize)

          // Draw mid indicator
          if (mid !== undefined) {
            const midX = (mid % boxesPerRow) * boxSize + boxSize / 2
            const midY = Math.floor(mid / boxesPerRow) * boxSize

            ctx.strokeStyle = "rgba(16, 185, 129, 0.7)" // Green
            ctx.beginPath()
            ctx.moveTo(midX, midY - 5)
            ctx.lineTo(midX, midY + boxSize + 5)
            ctx.stroke()

            // Add "mid" label
            ctx.fillStyle = document.documentElement.classList.contains("dark") ? "white" : "black"
            ctx.font = "10px Arial"
            ctx.textAlign = "center"
            ctx.fillText("mid", midX, midY - 8)
          }
        }
      }
    }

    // Request animation frame for smooth updates
  

    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame)
        setAnimationFrame(animationFrame)
      }
    }
  }, [array, state, type, searchTarget, animationFrame])

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{algorithm.name}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{algorithm.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {type === "sorting" ? <BarChart3 className="h-3 w-3 mr-1" /> : <Search className="h-3 w-3 mr-1" />}
              {type === "sorting" ? "Sorting" : "Searching"}
            </Badge>

            {state.completed && (
              <Badge className="bg-green-600 text-white">
                <Clock className="h-3 w-3 mr-1" />
                {(state.timeElapsed / 1000).toFixed(2)}s
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-700 dark:text-slate-300 text-sm">Progress</span>
            <span className="text-slate-700 dark:text-slate-300 text-sm">{Math.round(state.progress)}%</span>
          </div>
          <Progress value={state.progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <span className="text-slate-600 dark:text-slate-400 text-sm">Comparisons</span>
            <p className="text-slate-900 dark:text-white font-mono">{state.comparisons}</p>
          </div>

          {type === "sorting" && (
            <div>
              <span className="text-slate-600 dark:text-slate-400 text-sm">Swaps</span>
              <p className="text-slate-900 dark:text-white font-mono">{state.swaps}</p>
            </div>
          )}

          <div>
            <span className="text-slate-600 dark:text-slate-400 text-sm">Time Complexity</span>
            <div className="flex flex-col">
              <span className="text-slate-900 dark:text-white text-sm">
                Best: <span className="font-mono">{algorithm.timeComplexity.best}</span>
              </span>
              <span className="text-slate-900 dark:text-white text-sm">
                Avg: <span className="font-mono">{algorithm.timeComplexity.average}</span>
              </span>
              <span className="text-slate-900 dark:text-white text-sm">
                Worst: <span className="font-mono">{algorithm.timeComplexity.worst}</span>
              </span>
            </div>
          </div>

          <div>
            <span className="text-slate-600 dark:text-slate-400 text-sm">Space Complexity</span>
            <p className="text-slate-900 dark:text-white font-mono">{algorithm.spaceComplexity}</p>
          </div>
        </div>

        {type === "searching" && algorithm.name === "Binary Search" && (
          <Alert className="mt-4 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
            <AlertDescription className="text-amber-800 dark:text-amber-400 text-sm">
              Binary Search requires a sorted array to work correctly.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="p-0">
        <canvas ref={canvasRef} className="w-full h-64" />
      </div>
    </div>
  )
}

