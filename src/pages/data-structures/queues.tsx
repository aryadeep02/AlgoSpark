"use client"

import { useState, useEffect } from "react"
import DataStructureVisualizer from "./data-structure-visualizer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export default function QueuesPage() {
  const [queue, setQueue] = useState<number[]>([10, 20, 30, 40, 50])
  const [newValue, setNewValue] = useState<string>("")
  const [isEnqueueDialogOpen, setIsEnqueueDialogOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [animationState, setAnimationState] = useState<"idle" | "enqueueing" | "dequeueing" | "peeking">("idle")
  const [animationStep, setAnimationStep] = useState<number>(0)
  const [animationMessage, setAnimationMessage] = useState<string>("")
  const [newElement, setNewElement] = useState<number | null>(null)

  // Reset animation state after completion
  useEffect(() => {
    if (animationState !== "idle" && animationStep > 0) {
      const timer = setTimeout(() => {
        if (animationStep < getMaxSteps()) {
          setAnimationStep(animationStep + 1)
          updateAnimationMessage()
        } else {
          // Animation complete
          setTimeout(() => {
            if (animationState !== "peeking") {
              setAnimationState("idle")
              setAnimationStep(0)
              setActiveIndex(null)
              setAnimationMessage("")
              setNewElement(null)
            } else {
              // For peeking, just keep highlighting the front element for a bit longer
              setTimeout(() => {
                setAnimationState("idle")
                setAnimationStep(0)
                setActiveIndex(null)
                setAnimationMessage("")
              }, 1500)
            }
          }, 1000)
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [animationState, animationStep])

  // Get max steps for current animation
  const getMaxSteps = () => {
    switch (animationState) {
      case "enqueueing":
        return 2
      case "dequeueing":
        return 2
      case "peeking":
        return 1
      default:
        return 0
    }
  }

  // Update animation message based on current step
  const updateAnimationMessage = () => {
    const val = newElement

    switch (animationState) {
      case "enqueueing":
        if (animationStep === 1) {
          setAnimationMessage(`Creating new node with value ${val}`)
        } else if (animationStep === 2) {
          setAnimationMessage(`Enqueued ${val} at the rear of the queue`)
        }
        break
      case "dequeueing":
        if (animationStep === 1) {
          setAnimationMessage(`Removing front element: ${queue[0]}`)
        } else if (animationStep === 2) {
          setAnimationMessage(`Dequeued ${queue[0]} from the queue`)
        }
        break
      case "peeking":
        setAnimationMessage(`Peeking at front element: ${queue[0]}`)
        break
    }
  }

  // Queue operations
  const handleEnqueue = () => {
    if (newValue.trim() === "") return

    const value = Number.parseInt(newValue)
    if (isNaN(value)) return

    setNewElement(value)
    setAnimationState("enqueueing")
    setAnimationStep(1)
    updateAnimationMessage()

    // Perform actual queue update after animation
    setTimeout(() => {
      setQueue([...queue, value])
      setActiveIndex(queue.length)
    }, 1000)

    setNewValue("")
    setIsEnqueueDialogOpen(false)
  }

  const handleDequeue = () => {
    if (queue.length === 0) return

    setAnimationState("dequeueing")
    setAnimationStep(1)
    setActiveIndex(0)
    updateAnimationMessage()

    // Perform actual queue update after animation
    setTimeout(() => {
      setQueue(queue.slice(1))
    }, 2000)
  }

  const handlePeek = () => {
    if (queue.length === 0) return

    setAnimationState("peeking")
    setAnimationStep(1)
    setActiveIndex(0)
    updateAnimationMessage()
  }

  const renderQueueVisualization = () => {
    return (
      <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 h-full flex flex-col">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Queue Visualization</h3>

        {animationMessage && (
          <div className="mb-4 p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-md text-center">
            {animationMessage}
          </div>
        )}

        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-row gap-1 items-center">
            {queue.map((value, idx) => (
              <div
                key={idx}
                className={`
                  w-16 h-16 flex items-center justify-center rounded-lg border-2 
                  ${
                    activeIndex === idx
                      ? animationState === "dequeueing"
                        ? "border-red-500 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 animate-pulse"
                        : animationState === "peeking"
                          ? "border-blue-500 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 animate-pulse"
                          : "border-purple-500 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 animate-pulse"
                      : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  }
                  transition-all duration-300
                  ${idx === 0 ? "relative" : ""}
                  ${idx === queue.length - 1 ? "relative" : ""}
                  ${animationState === "dequeueing" && idx === 0 && animationStep === 2 ? "transform -translate-x-10 opacity-0" : ""}
                `}
              >
                <span className="text-lg font-medium">{value}</span>
                {idx === 0 && (
                  <span className="absolute -bottom-8 text-sm text-slate-600 dark:text-slate-400">Front</span>
                )}
                {idx === queue.length - 1 && (
                  <span className="absolute -bottom-8 text-sm text-slate-600 dark:text-slate-400">Rear</span>
                )}
              </div>
            ))}

            {/* New element being enqueued */}
            {animationState === "enqueueing" && animationStep === 1 && newElement !== null && (
              <div className="w-16 h-16 flex items-center justify-center rounded-lg border-2 border-green-500 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 animate-bounce ml-4">
                <span className="text-lg font-medium">{newElement}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-slate-600 dark:text-slate-400">
          <p>Queue Size: {queue.length}</p>
          {queue.length > 0 ? (
            <p className="text-xs mt-1">Front Element: {queue[0]}</p>
          ) : (
            <p className="text-xs mt-1">Queue is empty</p>
          )}
        </div>
      </div>
    )
  }

  // Enqueue Dialog
  const EnqueueDialog = () => (
    <Dialog open={isEnqueueDialogOpen} onOpenChange={setIsEnqueueDialogOpen}>
      <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Enqueue Element</DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Add a new element to the end of the queue.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="enqueue-value" className="text-slate-700 dark:text-slate-300">
              Value
            </Label>
            <Input
              id="enqueue-value"
              type="number"
              placeholder="Enter a number"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsEnqueueDialogOpen(false)}
            className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white"
          >
            Cancel
          </Button>
          <Button onClick={handleEnqueue} className="bg-purple-600 hover:bg-purple-700">
            Enqueue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center">Queues</h1>

      <DataStructureVisualizer
        title="Queue"
        description="A linear data structure that follows the First In First Out (FIFO) principle"
        operations={[
          {
            name: "Enqueue",
            description: "Add an element to the end of the queue",
            action: () => setIsEnqueueDialogOpen(true),
            disabled: animationState !== "idle",
          },
          {
            name: "Dequeue",
            description: "Remove the front element from the queue",
            action: handleDequeue,
            disabled: queue.length === 0 || animationState !== "idle",
          },
          {
            name: "Peek",
            description: "View the front element without removing it",
            action: handlePeek,
            disabled: queue.length === 0 || animationState !== "idle",
          },
        ]}
        renderVisualization={renderQueueVisualization}
        codeImplementation={{
          JavaScript: `// Queue implementation using array
class Queue {
  constructor() {
    this.items = [];
  }
  
  // Add element to the end of the queue
  enqueue(element) {
    this.items.push(element);
  }
  
  // Remove and return the front element
  dequeue() {
    if (this.isEmpty()) {
      return "Underflow";
    }
    return this.items.shift();
  }
  
  // Return the front element without removing it
  peek() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items[0];
  }
  
  // Check if queue is empty
  isEmpty() {
    return this.items.length === 0;
  }
  
  // Return the size of the queue
  size() {
    return this.items.length;
  }
  
  // Clear the queue
  clear() {
    this.items = [];
  }
}

// Usage
const queue = new Queue();
queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);
console.log(queue.peek()); // 10
console.log(queue.dequeue()); // 10
console.log(queue.size()); // 2`,
          Python: `# Queue implementation using list
class Queue:
    def __init__(self):
        self.items = []
    
    # Add element to the end of the queue
    def enqueue(self, item):
        self.items.append(item)
    
    # Remove and return the front element
    def dequeue(self):
        if self.is_empty():
            return "Underflow"
        return self.items.pop(0)
    
    # Return the front element without removing it
    def peek(self):
        if self.is_empty():
            return "Queue is empty"
        return self.items[0]
    
    # Check if queue is empty
    def is_empty(self):
        return len(self.items) == 0
    
    # Return the size of the queue
    def size(self):
        return len(self.items)
    
    # Clear the queue
    def clear(self):
        self.items = []

# Usage
queue = Queue()
queue.enqueue(10)
queue.enqueue(20)
queue.enqueue(30)
print(queue.peek())    # 10
print(queue.dequeue()) # 10
print(queue.size())    # 2`,
          Java: `// Queue implementation using array
public class Queue {
    private int maxSize;
    private int[] queueArray;
    private int front;
    private int rear;
    private int currentSize;
    
    // Constructor
    public Queue(int size) {
        maxSize = size;
        queueArray = new int[maxSize];
        front = 0;
        rear = -1;
        currentSize = 0;
    }
    
    // Add element to the end of the queue
    public void enqueue(int value) {
        if (isFull()) {
            System.out.println("Queue is full");
            return;
        }
        
        // Circular queue implementation
        if (rear == maxSize - 1) {
            rear = -1;
        }
        
        queueArray[++rear] = value;
        currentSize++;
    }
    
    // Remove and return the front element
    public int dequeue() {
        if (isEmpty()) {
            System.out.println("Queue is empty");
            return -1;
        }
        
        int temp = queueArray[front++];
        
        // Circular queue implementation
        if (front == maxSize) {
            front = 0;
        }
        
        currentSize--;
        return temp;
    }
    
    // Return the front element without removing it
    public int peek() {
        if (isEmpty()) {
            System.out.println("Queue is empty");
            return -1;
        }
        return queueArray[front];
    }
    
    // Check if queue is empty
    public boolean isEmpty() {
        return (currentSize == 0);
    }
    
    // Check if queue is full
    public boolean isFull() {
        return (currentSize == maxSize);
    }
    
    // Return the size of the queue
    public int size() {
        return currentSize;
    }
}

// Usage
Queue queue = new Queue(10);
queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);
System.out.println(queue.peek());    // 10
System.out.println(queue.dequeue()); // 10
System.out.println(queue.size());    // 2`,
        }}
        information={{
          characteristics: [
            "Follows First In First Out (FIFO) principle",
            "Elements are added at the rear and removed from the front",
            "Insertion and deletion operations are performed at opposite ends",
            "Can be implemented using arrays or linked lists",
            "Has a restricted access pattern - only the front element can be removed",
          ],
          useCases: [
            "CPU scheduling in operating systems",
            "Handling of interrupts in real-time systems",
            "Breadth-first search algorithm implementation",
            "Print job scheduling",
            "Buffering for data streams",
          ],
          timeComplexity: {
            Enqueue: "O(1)",
            Dequeue: "O(1) for linked list, O(n) for array",
            Peek: "O(1)",
            Search: "O(n)",
            "Access (other than front)": "O(n)",
          },
          spaceComplexity: "O(n)",
          types: [
            {
              name: "Simple Queue",
              description:
                "Basic queue with elements added at rear and removed from front. When using arrays, dequeue operations can be inefficient as they require shifting elements.",
            },
            {
              name: "Circular Queue",
              description:
                "Efficient implementation using arrays where the queue wraps around to the beginning when it reaches the end, avoiding the need to shift elements.",
            },
            {
              name: "Priority Queue",
              description:
                "Elements have associated priorities and are dequeued based on their priority rather than insertion order.",
            },
            {
              name: "Double-ended Queue (Deque)",
              description:
                "Allows insertion and removal of elements from both ends, providing more flexibility than standard queues.",
            },
          ],
        }}
      />

      <EnqueueDialog />
    </>
  )
}

