
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw, Code, Info, Link, AlertCircle } from "lucide-react"
import { generateRandomArray } from "@/lib/array-utils"
import AlgorithmVisualizer from "./pages/race/algorithm-visualizer"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AlgorithmDetailProps {
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
  type: "sorting" | "searching"
  algorithmKey: string
}

export default function AlgorithmDetail({ algorithm, type, algorithmKey }: AlgorithmDetailProps) {
  const [array, setArray] = useState<number[]>([])
  const [arraySize, setArraySize] = useState(30)
  const [speed, setSpeed] = useState(50)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [searchTarget, setSearchTarget] = useState<number | null>(null)
  const [state, setState] = useState({
    progress: 0,
    comparisons: 0,
    swaps: 0,
    currentArray: [] as number[],
    currentIndices: [] as number[],
    completed: false,
    timeElapsed: 0,
  })

  // Initialize array on component mount
  useEffect(() => {
    resetArray()
  }, [arraySize, type])

  const resetArray = () => {
    const newArray = generateRandomArray(arraySize, 5, 100)

    // If binary search, sort the array
    if (type === "searching" && algorithmKey === "binarySearch") {
      newArray.sort((a, b) => a - b)
    }

    setArray(newArray)

    if (type === "searching") {
      setSearchTarget(newArray[Math.floor(Math.random() * newArray.length)])
    }

    setState({
      progress: 0,
      comparisons: 0,
      swaps: 0,
      currentArray: [...newArray],
      currentIndices: [],
      completed: false,
      timeElapsed: 0,
    })

    setIsRunning(false)
    setIsPaused(false)
  }

  const startVisualization = () => {
    if (isPaused) {
      setIsPaused(false)
      return
    }

    setIsRunning(true)

    // Get the actual algorithm implementation
    let algorithmFunction: Function
    const isSorting = type === "sorting"

    if (isSorting) {
      switch (algorithmKey) {
        case "bubbleSort":
          algorithmFunction = bubbleSort
          break
        case "selectionSort":
          algorithmFunction = selectionSort
          break
        case "insertionSort":
          algorithmFunction = insertionSort
          break
        case "mergeSort":
          algorithmFunction = mergeSort
          break
        case "quickSort":
          algorithmFunction = quickSort
          break
        default:
          algorithmFunction = bubbleSort
      }
    } else {
      switch (algorithmKey) {
        case "linearSearch":
          algorithmFunction = linearSearch
          break
        case "binarySearch":
          algorithmFunction = binarySearch
          break
        default:
          algorithmFunction = linearSearch
      }
    }

    // Start the visualization
    const startTime = Date.now()
    let steps: any[] = []

    if (isSorting) {
      // For sorting algorithms
      steps = algorithmFunction([...array])
    } else {
      // For searching algorithms
      if (searchTarget !== null) {
        steps = algorithmFunction([...array], searchTarget)
      }
    }

    // Execute the steps with animation
    let stepIndex = 0
    const totalSteps = steps.length

    const interval = setInterval(
      () => {
        if (isPaused) return

        if (stepIndex < totalSteps) {
          const step = steps[stepIndex]

          setState((prevState) => ({
            ...prevState,
            progress: Math.round((stepIndex / totalSteps) * 100),
            comparisons: prevState.comparisons + (step.comparison ? 1 : 0),
            swaps: prevState.swaps + (step.swap ? 1 : 0),
            currentArray: step.array ? [...step.array] : prevState.currentArray,
            currentIndices: step.indices || [],
            timeElapsed: Date.now() - startTime,
          }))

          stepIndex++
        } else {
          // Completed
          setState((prevState) => ({
            ...prevState,
            progress: 100,
            completed: true,
            timeElapsed: Date.now() - startTime,
          }))

          clearInterval(interval)
          setIsRunning(false)
        }
      },
      1000 / (speed / 10),
    ) // Adjust speed

    return () => clearInterval(interval)
  }

  const pauseVisualization = () => {
    setIsPaused(true)
  }

  // Bubble Sort implementation with visualization steps
  function bubbleSort(arr: number[]) {
    const steps: any[] = []
    const n = arr.length
    let swapped

    for (let i = 0; i < n; i++) {
      swapped = false

      for (let j = 0; j < n - i - 1; j++) {
        // Add comparison step
        steps.push({
          array: [...arr],
          indices: [j, j + 1],
          comparison: true,
          swap: false,
        })

        if (arr[j] > arr[j + 1]) {
          // Swap
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          swapped = true

          // Add swap step
          steps.push({
            array: [...arr],
            indices: [j, j + 1],
            comparison: false,
            swap: true,
          })
        }
      }

      if (!swapped) break
    }

    // Final state
    steps.push({
      array: [...arr],
      indices: [],
      comparison: false,
      swap: false,
    })

    return steps
  }

  // Selection Sort implementation with visualization steps
  function selectionSort(arr: number[]) {
    const steps: any[] = []
    const n = arr.length

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i

      for (let j = i + 1; j < n; j++) {
        // Add comparison step
        steps.push({
          array: [...arr],
          indices: [minIdx, j],
          comparison: true,
          swap: false,
        })

        if (arr[j] < arr[minIdx]) {
          minIdx = j
        }
      }

      if (minIdx !== i) {
        // Swap
        ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]

        // Add swap step
        steps.push({
          array: [...arr],
          indices: [i, minIdx],
          comparison: false,
          swap: true,
        })
      }
    }

    // Final state
    steps.push({
      array: [...arr],
      indices: [],
      comparison: false,
      swap: false,
    })

    return steps
  }

  // Insertion Sort implementation with visualization steps
  function insertionSort(arr: number[]) {
    const steps: any[] = []
    const n = arr.length

    for (let i = 1; i < n; i++) {
      const key = arr[i]
      let j = i - 1

      // Add comparison step
      steps.push({
        array: [...arr],
        indices: [i, j],
        comparison: true,
        swap: false,
      })

      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j]

        // Add swap step
        steps.push({
          array: [...arr],
          indices: [j, j + 1],
          comparison: false,
          swap: true,
        })

        j--

        if (j >= 0) {
          // Add comparison step
          steps.push({
            array: [...arr],
            indices: [i, j],
            comparison: true,
            swap: false,
          })
        }
      }

      arr[j + 1] = key

      // Add placement step
      steps.push({
        array: [...arr],
        indices: [j + 1],
        comparison: false,
        swap: true,
      })
    }

    // Final state
    steps.push({
      array: [...arr],
      indices: [],
      comparison: false,
      swap: false,
    })

    return steps
  }

  // Merge Sort implementation with visualization steps
  function mergeSort(arr: number[]) {
    const steps: any[] = []

    function merge(arr: number[], left: number, mid: number, right: number) {
      const n1 = mid - left + 1
      const n2 = right - mid

      const L = arr.slice(left, mid + 1)
      const R = arr.slice(mid + 1, right + 1)

      let i = 0,
        j = 0,
        k = left

      while (i < n1 && j < n2) {
        // Add comparison step
        steps.push({
          array: [...arr],
          indices: [left + i, mid + 1 + j],
          comparison: true,
          swap: false,
        })

        if (L[i] <= R[j]) {
          arr[k] = L[i]
          i++
        } else {
          arr[k] = R[j]
          j++
        }

        // Add placement step
        steps.push({
          array: [...arr],
          indices: [k],
          comparison: false,
          swap: true,
        })

        k++
      }

      while (i < n1) {
        arr[k] = L[i]

        // Add placement step
        steps.push({
          array: [...arr],
          indices: [k],
          comparison: false,
          swap: true,
        })

        i++
        k++
      }

      while (j < n2) {
        arr[k] = R[j]

        // Add placement step
        steps.push({
          array: [...arr],
          indices: [k],
          comparison: false,
          swap: true,
        })

        j++
        k++
      }
    }

    function mergeSortHelper(arr: number[], left: number, right: number) {
      if (left < right) {
        const mid = Math.floor((left + right) / 2)

        mergeSortHelper(arr, left, mid)
        mergeSortHelper(arr, mid + 1, right)

        merge(arr, left, mid, right)
      }
    }

    mergeSortHelper([...arr], 0, arr.length - 1)

    // Final state
    steps.push({
      array: [...arr],
      indices: [],
      comparison: false,
      swap: false,
    })

    return steps
  }

  // Quick Sort implementation with visualization steps
  function quickSort(arr: number[]) {
    const steps: any[] = []

    function partition(arr: number[], low: number, high: number) {
      const pivot = arr[high]
      let i = low - 1

      for (let j = low; j < high; j++) {
        // Add comparison step
        steps.push({
          array: [...arr],
          indices: [j, high],
          comparison: true,
          swap: false,
        })

        if (arr[j] < pivot) {
          i++

          // Swap
          ;[arr[i], arr[j]] = [arr[j], arr[i]]

          // Add swap step
          steps.push({
            array: [...arr],
            indices: [i, j],
            comparison: false,
            swap: true,
          })
        }
      }
      // Swap
      ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]

      // Add swap step
      steps.push({
        array: [...arr],
        indices: [i + 1, high],
        comparison: false,
        swap: true,
      })

      return i + 1
    }

    function quickSortHelper(arr: number[], low: number, high: number) {
      if (low < high) {
        const pi = partition(arr, low, high)

        quickSortHelper(arr, low, pi - 1)
        quickSortHelper(arr, pi + 1, high)
      }
    }

    const arrCopy = [...arr]
    quickSortHelper(arrCopy, 0, arrCopy.length - 1)

    // Final state
    steps.push({
      array: arrCopy,
      indices: [],
      comparison: false,
      swap: false,
    })

    return steps
  }

  // Linear Search implementation with visualization steps
  function linearSearch(arr: number[], target: number) {
    const steps: any[] = []

    for (let i = 0; i < arr.length; i++) {
      // Add comparison step
      steps.push({
        array: [...arr],
        indices: [i],
        comparison: true,
        swap: false,
      })

      if (arr[i] === target) {
        // Found
        steps.push({
          array: [...arr],
          indices: [i],
          comparison: true,
          swap: false,
          found: true,
        })

        return steps
      }
    }

    // Not found
    steps.push({
      array: [...arr],
      indices: [],
      comparison: false,
      swap: false,
      found: false,
    })

    return steps
  }

  // Binary Search implementation with visualization steps
  function binarySearch(arr: number[], target: number) {
    const steps: any[] = []
    let left = 0
    let right = arr.length - 1

    while (left <= right) {
      const mid = Math.floor((left + right) / 2)

      // Add comparison step
      steps.push({
        array: [...arr],
        indices: [left, mid, right],
        comparison: true,
        swap: false,
      })

      if (arr[mid] === target) {
        // Found
        steps.push({
          array: [...arr],
          indices: [mid],
          comparison: true,
          swap: false,
          found: true,
        })

        return steps
      }

      if (arr[mid] < target) {
        left = mid + 1
      } else {
        right = mid - 1
      }

      // Add update step
      steps.push({
        array: [...arr],
        indices: [left, Math.floor((left + right) / 2), right],
        comparison: false,
        swap: false,
      })
    }

    // Not found
    steps.push({
      array: [...arr],
      indices: [],
      comparison: false,
      swap: false,
      found: false,
    })

    return steps
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{algorithm.name}</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{algorithm.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={resetArray}
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
                onClick={isPaused ? startVisualization : pauseVisualization}
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
                onClick={startVisualization}
              >
                <Play className="h-4 w-4 mr-1" />
                Visualize
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <Tabs defaultValue="visualization">
          <TabsList className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <TabsTrigger value="visualization" className="data-[state=active]:bg-purple-600">
              Visualization
            </TabsTrigger>
            <TabsTrigger value="code" className="data-[state=active]:bg-blue-600">
              Code
            </TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-green-600">
              Information
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualization" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-700 dark:text-white">Array Size: {arraySize}</span>
                  <span className="text-slate-600 dark:text-slate-400 text-sm">(5-100)</span>
                </div>
                <Slider
                  value={[arraySize]}
                  min={5}
                  max={100}
                  step={1}
                  onValueChange={(value) => {
                    setArraySize(value[0])
                  }}
                  disabled={isRunning && !isPaused}
                  className="py-4"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
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

            {type === "searching" && algorithmKey === "binarySearch" && (
              <Alert className="mb-4 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                <AlertDescription className="text-amber-800 dark:text-amber-400 text-sm">
                  Binary Search requires a sorted array. The array has been automatically sorted for this demonstration.
                </AlertDescription>
              </Alert>
            )}

            <AlgorithmVisualizer
              algorithm={algorithm}
              array={array}
              state={state}
              type={type}
              searchTarget={searchTarget}
            />

            {type === "searching" && (
              <div className="mt-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 dark:text-white font-medium">Search Target:</span>
                  <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-sm font-medium">
                    {searchTarget !== null ? searchTarget : "None"}
                  </span>
                </div>

                <div className="mt-4">
                  <h4 className="text-slate-700 dark:text-white font-medium mb-2">How {algorithm.name} Works:</h4>
                  {algorithmKey === "linearSearch" ? (
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Linear Search checks each element of the array one by one until it finds the target value or
                      reaches the end of the array. It's simple but can be slow for large arrays.
                    </p>
                  ) : (
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Binary Search works by repeatedly dividing the search interval in half. It requires a sorted
                      array. The algorithm compares the target value to the middle element of the array and eliminates
                      half of the remaining elements in each step.
                    </p>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="code" className="mt-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white flex items-center">
                  <Code className="h-5 w-5 mr-2 text-blue-500" />
                  Implementation
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Link className="h-4 w-4 mr-1" />
                  View Full Code
                </Button>
              </div>

              <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm text-slate-300 font-mono">
                {type === "sorting" &&
                  algorithmKey === "bubbleSort" &&
                  `function bubbleSort(arr) {
  const n = arr.length;
  let swapped;
  
  for (let i = 0; i < n; i++) {
    swapped = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap them if they are in wrong order
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    
    // If no swapping occurred in this pass, array is sorted
    if (!swapped) break;
  }
  
  return arr;
}`}
                {type === "sorting" &&
                  algorithmKey === "selectionSort" &&
                  `function selectionSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    // Find the minimum element in the unsorted part
    let minIdx = i;
    
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    
    // Swap the found minimum element with the first element
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  
  return arr;
}`}
                {type === "sorting" &&
                  algorithmKey === "insertionSort" &&
                  `function insertionSort(arr) {
  const n = arr.length;
  
  for (let i = 1; i < n; i++) {
    // Pick the current element to be inserted
    let key = arr[i];
    let j = i - 1;
    
    // Move elements greater than key to one position ahead
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    // Insert the key at its correct position
    arr[j + 1] = key;
  }
  
  return arr;
}`}
                {type === "sorting" &&
                  algorithmKey === "mergeSort" &&
                  `function mergeSort(arr) {
  // Base case
  if (arr.length <= 1) return arr;
  
  // Split array into halves
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  
  // Recursively sort both halves
  return merge(
    mergeSort(left),
    mergeSort(right)
  );
}

function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  // Compare elements from both arrays and merge them in sorted order
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  // Add remaining elements
  return result
    .concat(left.slice(leftIndex))
    .concat(right.slice(rightIndex));
}`}
                {type === "sorting" &&
                  algorithmKey === "quickSort" &&
                  `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Find the partition index
    const pi = partition(arr, low, high);
    
    // Recursively sort elements before and after partition
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  
  return arr;
}

function partition(arr, low, high) {
  // Choose the rightmost element as pivot
  const pivot = arr[high];
  let i = low - 1;
  
  // Move all elements smaller than pivot to the left
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  // Place pivot in its final position
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`}
                {type === "searching" &&
                  algorithmKey === "linearSearch" &&
                  `function linearSearch(arr, target) {
  // Check each element one by one
  for (let i = 0; i < arr.length; i++) {
    // If element is found, return its index
    if (arr[i] === target) {
      return i;
    }
  }
  
  // Element not found
  return -1;
}`}
                {type === "searching" &&
                  algorithmKey === "binarySearch" &&
                  `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    // Check if target is present at mid
    if (arr[mid] === target) {
      return mid;
    }
    
    // If target greater, ignore left half
    if (arr[mid] < target) {
      left = mid + 1;
    } 
    // If target is smaller, ignore right half
    else {
      right = mid - 1;
    }
  }
  
  // Element is not present
  return -1;
}`}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="info" className="mt-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center mb-4">
                <Info className="h-5 w-5 mr-2 text-green-500" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Algorithm Details</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-slate-900 dark:text-white font-medium mb-2">Time Complexity</h4>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    <li>
                      <span className="text-green-600 dark:text-green-400">Best Case:</span>{" "}
                      {algorithm.timeComplexity.best}
                    </li>
                    <li>
                      <span className="text-yellow-600 dark:text-yellow-400">Average Case:</span>{" "}
                      {algorithm.timeComplexity.average}
                    </li>
                    <li>
                      <span className="text-red-600 dark:text-red-400">Worst Case:</span>{" "}
                      {algorithm.timeComplexity.worst}
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-slate-900 dark:text-white font-medium mb-2">Space Complexity</h4>
                  <p className="text-slate-700 dark:text-slate-300">{algorithm.spaceComplexity}</p>
                </div>

                <div>
                  <h4 className="text-slate-900 dark:text-white font-medium mb-2">Key Characteristics</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    {type === "sorting" && algorithmKey === "bubbleSort" && (
                      <>
                        <li>Simple implementation</li>
                        <li>Stable sorting algorithm</li>
                        <li>In-place algorithm (requires O(1) extra space)</li>
                        <li>Not suitable for large datasets</li>
                      </>
                    )}
                    {type === "sorting" && algorithmKey === "selectionSort" && (
                      <>
                        <li>Simple implementation</li>
                        <li>Not stable by default</li>
                        <li>In-place algorithm (requires O(1) extra space)</li>
                        <li>Performs well on small arrays</li>
                        <li>Makes the minimum number of swaps (n-1 in the worst case)</li>
                      </>
                    )}
                    {type === "sorting" && algorithmKey === "insertionSort" && (
                      <>
                        <li>Simple implementation</li>
                        <li>Stable sorting algorithm</li>
                        <li>In-place algorithm (requires O(1) extra space)</li>
                        <li>Efficient for small data sets</li>
                        <li>Adaptive - efficient for data sets that are already substantially sorted</li>
                      </>
                    )}
                    {type === "sorting" && algorithmKey === "mergeSort" && (
                      <>
                        <li>Divide and conquer algorithm</li>
                        <li>Stable sorting algorithm</li>
                        <li>Not in-place (requires O(n) extra space)</li>
                        <li>Predictable performance regardless of input data</li>
                        <li>Well-suited for linked lists</li>
                      </>
                    )}
                    {type === "sorting" && algorithmKey === "quickSort" && (
                      <>
                        <li>Divide and conquer algorithm</li>
                        <li>Not stable by default</li>
                        <li>In-place algorithm (requires O(log n) extra space for recursion)</li>
                        <li>Very efficient for large datasets</li>
                        <li>Performance depends on pivot selection</li>
                      </>
                    )}
                    {type === "searching" && algorithmKey === "linearSearch" && (
                      <>
                        <li>Simple implementation</li>
                        <li>Works on unsorted arrays</li>
                        <li>No prerequisites for the data</li>
                        <li>Inefficient for large datasets</li>
                      </>
                    )}
                    {type === "searching" && algorithmKey === "binarySearch" && (
                      <>
                        <li>Requires sorted array</li>
                        <li>Very efficient for large datasets</li>
                        <li>Divide and conquer approach</li>
                        <li>Logarithmic time complexity</li>
                      </>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="text-slate-900 dark:text-white font-medium mb-2">Applications</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    {type === "sorting" && algorithmKey === "bubbleSort" && (
                      <>
                        <li>Educational purposes</li>
                        <li>Small datasets with nearly sorted elements</li>
                        <li>When simplicity is more important than efficiency</li>
                      </>
                    )}
                    {type === "sorting" && algorithmKey === "selectionSort" && (
                      <>
                        <li>Educational purposes</li>
                        <li>Small datasets</li>
                        <li>When memory usage is a concern</li>
                        <li>When the number of writes needs to be minimized</li>
                      </>
                    )}
                    {type === "sorting" && algorithmKey === "insertionSort" && (
                      <>
                        <li>Small datasets</li>
                        <li>Nearly sorted datasets</li>
                        <li>Online algorithms (where data arrives one piece at a time)</li>
                        <li>As part of more complex algorithms like Shellsort</li>
                      </>
                    )}
                    {type === "sorting" && algorithmKey === "mergeSort" && (
                      <>
                        <li>External sorting (when data doesn't fit in memory)</li>
                        <li>Linked list sorting</li>
                        <li>Stable sorting requirements</li>
                        <li>When predictable performance is needed</li>
                      </>
                    )}
                    {type === "sorting" && algorithmKey === "quickSort" && (
                      <>
                        <li>General-purpose sorting</li>
                        <li>Large datasets</li>
                        <li>Systems with good cache locality</li>
                        <li>When average-case performance is important</li>
                      </>
                    )}
                    {type === "searching" && algorithmKey === "linearSearch" && (
                      <>
                        <li>Small datasets</li>
                        <li>Unsorted arrays</li>
                        <li>One-time searches where preprocessing would be overkill</li>
                        <li>Searching for multiple occurrences of an element</li>
                      </>
                    )}
                    {type === "searching" && algorithmKey === "binarySearch" && (
                      <>
                        <li>Dictionaries and phone books</li>
                        <li>Database systems</li>
                        <li>Finding elements in sorted arrays</li>
                        <li>Computer graphics</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

