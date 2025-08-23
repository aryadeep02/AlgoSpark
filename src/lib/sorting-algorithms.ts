export const sortingAlgorithms: Record<
string,
{
  name: string;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
}
>  = {
  bubbleSort: {
    name: "Bubble Sort",
    description:
      "Simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.",
    timeComplexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    spaceComplexity: "O(1)",
  },
  selectionSort: {
    name: "Selection Sort",
    description:
      "Simple comparison-based algorithm that divides the input list into a sorted and an unsorted region, and repeatedly selects the smallest element from the unsorted region.",
    timeComplexity: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    spaceComplexity: "O(1)",
  },
  insertionSort: {
    name: "Insertion Sort",
    description:
      "Simple comparison-based algorithm that builds the final sorted array one item at a time, efficient for small data sets.",
    timeComplexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    spaceComplexity: "O(1)",
  },
  mergeSort: {
    name: "Merge Sort",
    description:
      "Efficient, stable, comparison-based, divide and conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.",
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
    spaceComplexity: "O(n)",
  },
  quickSort: {
    name: "Quick Sort",
    description:
      "Efficient, in-place, divide and conquer algorithm that selects a 'pivot' element and partitions the array around the pivot.",
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²)",
    },
    spaceComplexity: "O(log n)",
  },
}

