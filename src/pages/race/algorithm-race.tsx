"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw, Settings, Zap, AlertCircle } from "lucide-react"
import AlgorithmVisualizer from "./algorithm-visualizer"
import CustomInput from "./custom-input"
import RaceLeaderboard from "./race-leaderboard"
import { generateRandomArray } from "@/lib/array-utils"
import { sortingAlgorithms } from "@/lib/sorting-algorithms"
import { searchingAlgorithms } from "@/lib/searching-algorithms"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AlgorithmRace() {
  const [algorithmType, setAlgorithmType] = useState<"sorting" | "searching">("sorting")

  const [array, setArray] = useState<number[]>([])
  const [arraySize, setArraySize] = useState(30)
  const [speed, setSpeed] = useState(50)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([])
  const [algorithmStates, setAlgorithmStates] = useState<{ [key: string]: any }>({})
  const [searchTarget, setSearchTarget] = useState<number | null>(null)

  // Initialize array and algorithm states
  useEffect(() => {
    resetArray()
  }, [arraySize, algorithmType])

  const resetArray = () => {
    const newArray = generateRandomArray(arraySize, 5, 100)

    // If searching with binary search selected, sort the array
    if (algorithmType === "searching" && selectedAlgorithms.includes("binarySearch")) {
      newArray.sort((a, b) => a - b)
    }

    setArray(newArray)

    // If searching, set a random target
    if (algorithmType === "searching") {
      const randomIndex = Math.floor(Math.random() * newArray.length)
      setSearchTarget(newArray[randomIndex])
    }

    // Reset algorithm states
    const algorithms = algorithmType === "sorting" ? sortingAlgorithms : searchingAlgorithms
    const initialStates: { [key: string]: any } = {}

    Object.keys(algorithms).forEach((key) => {
      initialStates[key] = {
        progress: 0,
        comparisons: 0,
        swaps: 0,
        currentArray: [...newArray],
        currentIndices: [],
        completed: false,
        timeElapsed: 0,
      }
    })

    setAlgorithmStates(initialStates)
    setIsRunning(false)
    setIsPaused(false)
  }

  const toggleAlgorithm = (algorithmName: string) => {
    if (selectedAlgorithms.includes(algorithmName)) {
      setSelectedAlgorithms(selectedAlgorithms.filter((name) => name !== algorithmName))
    } else {
      setSelectedAlgorithms([...selectedAlgorithms, algorithmName])

      // If binary search is selected, sort the array
      if (algorithmType === "searching" && algorithmName === "binarySearch") {
        const sortedArray = [...array].sort((a, b) => a - b)
        setArray(sortedArray)

        // Update all algorithm states with the sorted array
        setAlgorithmStates((prevStates) => {
          const newStates = { ...prevStates }
          Object.keys(newStates).forEach((key) => {
            newStates[key] = {
              ...newStates[key],
              currentArray: [...sortedArray],
            }
          })
          return newStates
        })
      }
    }
  }

  const startRace = () => {
    // If we're resuming from a paused state
    if (isPaused) {
      setIsPaused(false)
      return
    }

    if (selectedAlgorithms.length === 0) return

    setIsRunning(true)

    // Start time for each algorithm
    const startTimes: { [key: string]: number } = {}
    const pausedTimes: { [key: string]: number } = {}

    selectedAlgorithms.forEach((algo) => {
      startTimes[algo] = Date.now()
      pausedTimes[algo] = 0
    })

    // Store the interval ID so we can clear it when pausing
    let intervalId: NodeJS.Timeout

    const runInterval = () => {
      intervalId = setInterval(() => {
        setAlgorithmStates((prevStates) => {
          const newStates = { ...prevStates }
          let allCompleted = true

          selectedAlgorithms.forEach((algo) => {
            if (!newStates[algo].completed) {
              // Calculate elapsed time, accounting for paused time
              const timeElapsed = Date.now() - startTimes[algo] - pausedTimes[algo]

              // Simulate progress based on algorithm efficiency
              let progressIncrement = 0
              let comparisonIncrement = 0
              let swapIncrement = 0

              if (algorithmType === "sorting") {
                // Different progress rates based on algorithm efficiency
                switch (algo) {
                  case "quickSort":
                  case "mergeSort":
                    progressIncrement = (Math.random() * 3 + 2) * (speed / 50)
                    comparisonIncrement = Math.floor(Math.random() * 2) + 1
                    swapIncrement = Math.floor(Math.random() * 1) + 1
                    break
                  case "insertionSort":
                    progressIncrement = (Math.random() * 2 + 1) * (speed / 50)
                    comparisonIncrement = Math.floor(Math.random() * 3) + 1
                    swapIncrement = Math.floor(Math.random() * 2) + 1
                    break
                  case "selectionSort":
                  case "bubbleSort":
                    progressIncrement = (Math.random() * 1 + 0.5) * (speed / 50)
                    comparisonIncrement = Math.floor(Math.random() * 4) + 2
                    swapIncrement = Math.floor(Math.random() * 3) + 1
                    break
                  default:
                    progressIncrement = Math.random() * 2 * (speed / 50)
                    comparisonIncrement = Math.floor(Math.random() * 3) + 1
                    swapIncrement = Math.floor(Math.random() * 2) + 1
                }
              } else {
                // Searching algorithms
                switch (algo) {
                  case "binarySearch":
                    progressIncrement = (Math.random() * 5 + 5) * (speed / 50)
                    comparisonIncrement = 1
                    break
                  case "linearSearch":
                    progressIncrement = (Math.random() * 2 + 1) * (speed / 50)
                    comparisonIncrement = Math.floor(Math.random() * 3) + 1
                    break
                  default:
                    progressIncrement = Math.random() * 3 * (speed / 50)
                    comparisonIncrement = Math.floor(Math.random() * 2) + 1
                }
              }

              const newProgress = Math.min(100, newStates[algo].progress + progressIncrement)

              // Simulate array changes
              let currentArray = [...newStates[algo].currentArray]
              let currentIndices: number[] = []

              if (algorithmType === "sorting") {
                // For sorting, gradually sort the array as progress increases
                if (newProgress > newStates[algo].progress) {
                  const sortProgress = newProgress / 100
                  const originalArray = [...array]
                  const sortedArray = [...array].sort((a, b) => a - b)

                  // Create a partially sorted array based on progress
                  currentArray = originalArray.map((val, idx) => {
                    if (Math.random() < sortProgress) {
                      return sortedArray[idx]
                    }
                    return val
                  })

                  // Add some random indices for visualization
                  const numIndices = Math.floor(Math.random() * 3) + 1
                  for (let i = 0; i < numIndices; i++) {
                    currentIndices.push(Math.floor(Math.random() * array.length))
                  }
                }
              } else {
                // For searching, simulate the search process
                if (algo === "binarySearch") {
                  // Binary search visualization
                  const progress = newProgress / 100
                  const arrayLength = array.length
                  const left = Math.floor((arrayLength * (1 - progress)) / 2)
                  const right = Math.floor((arrayLength * (1 + progress)) / 2)
                  const mid = Math.floor((left + right) / 2)

                  currentIndices = [left, mid, right]
                } else {
                  // Linear search visualization
                  const progress = newProgress / 100
                  const searchPosition = Math.floor(array.length * progress)
                  currentIndices = [searchPosition]
                }
              }

              newStates[algo] = {
                ...newStates[algo],
                progress: newProgress,
                comparisons: newStates[algo].comparisons + comparisonIncrement,
                swaps: algorithmType === "sorting" ? newStates[algo].swaps + swapIncrement : 0,
                timeElapsed: timeElapsed,
                currentArray: currentArray,
                currentIndices: currentIndices,
                completed: newProgress >= 100,
              }

              if (newProgress < 100) allCompleted = false
            }
          })

          if (allCompleted) {
            clearInterval(intervalId)
            setIsRunning(false)
          }

          return newStates
        })
      }, 100) // Update every 100ms for smoother animation
    }

    // Start the interval
    runInterval()

    // Store the interval cleanup function
    const cleanupInterval = () => {
      if (intervalId) clearInterval(intervalId)
    }

    return cleanupInterval
  }

  const pauseRace = () => {
    setIsPaused(true)
    // When pausing, we clear the current interval
    // The startRace function will create a new one when resuming
  }

  const resetRace = () => {
    resetArray()
  }

  const handleCustomInput = (input: number[]) => {
    setArray(input)

    // If binary search is selected, sort the array
    if (algorithmType === "searching" && selectedAlgorithms.includes("binarySearch")) {
      input.sort((a, b) => a - b)
    }

    // Reset algorithm states with new array
    const algorithms = algorithmType === "sorting" ? sortingAlgorithms : searchingAlgorithms
    const initialStates: { [key: string]: any } = {}

    Object.keys(algorithms).forEach((key) => {
      initialStates[key] = {
        progress: 0,
        comparisons: 0,
        swaps: 0,
        currentArray: [...input],
        currentIndices: [],
        completed: false,
        timeElapsed: 0,
      }
    })

    setAlgorithmStates(initialStates)
    setIsRunning(false)
    setIsPaused(false)
  }

  const handleSearchTargetChange = (target: number) => {
    setSearchTarget(target)
  }

  const handleAlgorithmTypeChange = (type: string) => {
    setAlgorithmType(type as "sorting" | "searching")
    setSelectedAlgorithms([])
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
              <Zap className="mr-2 h-5 w-5 text-yellow-500" />
              Algorithm Race
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Compare algorithm performance in real-time</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={resetRace}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>

            {isRunning ? (
              <Button
                variant={isPaused ? "default" : "outline"}
                size="sm"
                className={
                  isPaused
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }
                onClick={isPaused ? startRace : pauseRace}
              >
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={startRace}
                disabled={selectedAlgorithms.length === 0}
              >
                <Play className="h-4 w-4 mr-1" />
                Start Race
              </Button>
            )}

            <Button
              variant="outline"
              size="icon"
              className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <Tabs defaultValue="sorting" className="mb-6" onValueChange={handleAlgorithmTypeChange}>
          <TabsList className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <TabsTrigger value="sorting" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Sorting
            </TabsTrigger>
            <TabsTrigger value="searching" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Searching
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sorting" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {Object.keys(sortingAlgorithms).map((algo) => (
                <Button
                  key={algo}
                  variant={selectedAlgorithms.includes(algo) ? "default" : "outline"}
                  className={
                    selectedAlgorithms.includes(algo)
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  }
                  onClick={() => toggleAlgorithm(algo)}
                  disabled={isRunning && !isPaused}
                >
                  {sortingAlgorithms[algo].name}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="searching" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {Object.keys(searchingAlgorithms).map((algo) => (
                <Button
                  key={algo}
                  variant={selectedAlgorithms.includes(algo) ? "default" : "outline"}
                  className={
                    selectedAlgorithms.includes(algo)
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  }
                  onClick={() => toggleAlgorithm(algo)}
                  disabled={isRunning && !isPaused}
                >
                  {searchingAlgorithms[algo].name}
                </Button>
              ))}
            </div>

            {algorithmType === "searching" && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-slate-700 dark:text-white">Search Target:</span>
                <div className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-md">
                  {searchTarget !== null ? searchTarget : "None"}
                </div>
              </div>
            )}

            {algorithmType === "searching" && selectedAlgorithms.includes("binarySearch") && (
              <Alert className="mt-4 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                <AlertDescription className="text-amber-800 dark:text-amber-400 text-sm">
                  Binary Search requires a sorted array. The array has been automatically sorted.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-700 dark:text-white">Array Size: {arraySize}</span>
              <span className="text-slate-600 dark:text-slate-400 text-sm">(5-100)</span>
            </div>
            <Slider
              value={[arraySize]}
              min={5}
              max={100}
              step={1}
              onValueChange={(value) => setArraySize(value[0])}
              disabled={isRunning && !isPaused}
              className="py-4"
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-700 dark:text-white">Animation Speed: {speed}%</span>
              <span className="text-slate-600 dark:text-slate-400 text-sm">(Slow-Fast)</span>
            </div>
            <Slider
              value={[speed]}
              min={10}
              max={100}
              step={1}
              onValueChange={(value) => setSpeed(value[0])}
              className="py-4"
            />
          </div>
        </div>

        <div className="mb-6">
          <CustomInput
            onSubmit={handleCustomInput}
            onSearchTargetChange={handleSearchTargetChange}
            algorithmType={algorithmType}
            disabled={isRunning && !isPaused}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          {selectedAlgorithms.map((algo) => (
            <AlgorithmVisualizer
              key={algo}
              algorithm={algorithmType === "sorting" ? sortingAlgorithms[algo] : searchingAlgorithms[algo]}
              array={array}
              state={algorithmStates[algo]}
              type={algorithmType}
              searchTarget={searchTarget}
            />
          ))}
        </div>

        {selectedAlgorithms.length > 0 && (
          <div className="mt-8">
            <RaceLeaderboard
              algorithms={selectedAlgorithms.map((algo) => ({
                name: algorithmType === "sorting" ? sortingAlgorithms[algo].name : searchingAlgorithms[algo].name,
                progress: algorithmStates[algo]?.progress || 0,
                comparisons: algorithmStates[algo]?.comparisons || 0,
                swaps: algorithmStates[algo]?.swaps || 0,
                timeElapsed: algorithmStates[algo]?.timeElapsed || 0,
                completed: algorithmStates[algo]?.completed || false,
              }))}
              type={algorithmType}
            />
          </div>
        )}
      </div>
    </div>
  )
}

