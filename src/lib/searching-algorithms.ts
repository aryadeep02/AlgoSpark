export const searchingAlgorithms: Record<
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
  linearSearch: {
    name: "Linear Search",
    description:
      "Simple search algorithm that checks each element of the list until a match is found or the whole list has been searched.",
    timeComplexity: {
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
    },
    spaceComplexity: "O(1)",
  },
  binarySearch: {
    name: "Binary Search",
    description:
      "Efficient search algorithm that works on sorted arrays by repeatedly dividing the search interval in half.",
    timeComplexity: {
      best: "O(1)",
      average: "O(log n)",
      worst: "O(log n)",
    },
    spaceComplexity: "O(1)",
  },
}

