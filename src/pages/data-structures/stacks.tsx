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

export default function StacksPage() {
  const [stack, setStack] = useState<number[]>([10, 20, 30, 40, 50])
  const [newValue, setNewValue] = useState<string>("")
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [animationState, setAnimationState] = useState<"idle" | "pushing" | "popping" | "peeking">("idle")
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
              // For peeking, just keep highlighting the top element for a bit longer
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
      case "pushing":
        return 2
      case "popping":
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
      case "pushing":
        if (animationStep === 1) {
          setAnimationMessage(`Creating new node with value ${val}`)
        } else if (animationStep === 2) {
          setAnimationMessage(`Pushed ${val} to the top of the stack`)
        }
        break
      case "popping":
        if (animationStep === 1) {
          setAnimationMessage(`Removing top element: ${stack[stack.length - 1]}`)
        } else if (animationStep === 2) {
          setAnimationMessage(`Popped ${stack[stack.length - 1]} from the stack`)
        }
        break
      case "peeking":
        setAnimationMessage(`Peeking at top element: ${stack[stack.length - 1]}`)
        break
    }
  }

  // Stack operations
  const handlePush = () => {
    if (newValue.trim() === "") return

    const value = Number.parseInt(newValue)
    if (isNaN(value)) return

    setNewElement(value)
    setAnimationState("pushing")
    setAnimationStep(1)
    updateAnimationMessage()

    // Perform actual stack update after animation
    setTimeout(() => {
      setStack([...stack, value])
      setActiveIndex(stack.length)
    }, 1000)

    setNewValue("")
    setIsPushDialogOpen(false)
  }

  const handlePop = () => {
    if (stack.length === 0) return

    setAnimationState("popping")
    setAnimationStep(1)
    setActiveIndex(stack.length - 1)
    updateAnimationMessage()

    // Perform actual stack update after animation
    setTimeout(() => {
      setStack(stack.slice(0, -1))
    }, 2000)
  }

  const handlePeek = () => {
    if (stack.length === 0) return

    setAnimationState("peeking")
    setAnimationStep(1)
    setActiveIndex(stack.length - 1)
    updateAnimationMessage()
  }

  const renderStackVisualization = () => {
    return (
      <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 h-full flex flex-col">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Stack Visualization</h3>

        {animationMessage && (
          <div className="mb-4 p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-md text-center">
            {animationMessage}
          </div>
        )}

        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col-reverse gap-1 items-center">
            {/* New element being pushed */}
            {animationState === "pushing" && animationStep === 1 && newElement !== null && (
              <div
                className="w-48 h-12 flex items-center justify-center rounded-lg border-2 border-green-500 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 animate-bounce mb-4"
                style={{ transform: "translateY(-20px)" }}
              >
                <span className="text-lg font-medium">{newElement}</span>
              </div>
            )}

            {stack.map((value, idx) => (
              <div
                key={idx}
                className={`
                  w-48 h-12 flex items-center justify-center rounded-lg border-2 
                  ${
                    activeIndex === idx
                      ? animationState === "popping"
                        ? "border-red-500 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 animate-pulse"
                        : animationState === "peeking"
                          ? "border-blue-500 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 animate-pulse"
                          : "border-purple-500 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 animate-pulse"
                      : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  }
                  transition-all duration-300
                  ${idx === stack.length - 1 ? "relative" : ""}
                  ${animationState === "popping" && idx === stack.length - 1 && animationStep === 2 ? "transform -translate-y-10 opacity-0" : ""}
                `}
              >
                <span className="text-lg font-medium">{value}</span>
                {idx === stack.length - 1 && (
                  <span className="absolute -right-16 text-sm text-slate-600 dark:text-slate-400">← Top</span>
                )}
              </div>
            ))}

            <div className="w-48 h-2 bg-slate-300 dark:bg-slate-600 rounded-b-lg"></div>
          </div>
        </div>

        <div className="mt-4 text-center text-slate-600 dark:text-slate-400">
          <p>Stack Size: {stack.length}</p>
          {stack.length > 0 ? (
            <p className="text-xs mt-1">Top Element: {stack[stack.length - 1]}</p>
          ) : (
            <p className="text-xs mt-1">Stack is empty</p>
          )}
        </div>
      </div>
    )
  }

  // Push Dialog
  const PushDialog = () => (
    <Dialog open={isPushDialogOpen} onOpenChange={setIsPushDialogOpen}>
      <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Push Element</DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Add a new element to the top of the stack.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="push-value" className="text-slate-700 dark:text-slate-300">
              Value
            </Label>
            <Input
              id="push-value"
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
            onClick={() => setIsPushDialogOpen(false)}
            className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white"
          >
            Cancel
          </Button>
          <Button onClick={handlePush} className="bg-purple-600 hover:bg-purple-700">
            Push
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center">Stacks</h1>

      <DataStructureVisualizer
        title="Stack"
        description="A linear data structure that follows the Last In First Out (LIFO) principle"
        operations={[
          {
            name: "Push",
            description: "Add an element to the top of the stack",
            action: () => setIsPushDialogOpen(true),
            disabled: animationState !== "idle",
          },
          {
            name: "Pop",
            description: "Remove the top element from the stack",
            action: handlePop,
            disabled: stack.length === 0 || animationState !== "idle",
          },
          {
            name: "Peek",
            description: "View the top element without removing it",
            action: handlePeek,
            disabled: stack.length === 0 || animationState !== "idle",
          },
        ]}
        renderVisualization={renderStackVisualization}
        codeImplementation={{
          JavaScript: `// Stack implementation using array
class Stack {
  constructor() {
    this.items = [];
  }
  
  // Push element to the top of the stack
  push(element) {
    this.items.push(element);
  }
  
  // Remove and return the top element
  pop() {
    if (this.isEmpty()) {
      return "Underflow";
    }
    return this.items.pop();
  }
  
  // Return the top element without removing it
  peek() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.items[this.items.length - 1];
  }
  
  // Check if stack is empty
  isEmpty() {
    return this.items.length === 0;
  }
  
  // Return the size of the stack
  size() {
    return this.items.length;
  }
  
  // Clear the stack
  clear() {
    this.items = [];
  }
}

// Usage
const stack = new Stack();
stack.push(10);
stack.push(20);
stack.push(30);
console.log(stack.peek()); // 30
console.log(stack.pop());  // 30
console.log(stack.size()); // 2`,
          Python: `# Stack implementation using list
class Stack:
    def __init__(self):
        self.items = []
    
    # Push element to the top of the stack
    def push(self, item):
        self.items.append(item)
    
    # Remove and return the top element
    def pop(self):
        if self.is_empty():
            return "Underflow"
        return self.items.pop()
    
    # Return the top element without removing it
    def peek(self):
        if self.is_empty():
            return "Stack is empty"
        return self.items[-1]
    
    # Check if stack is empty
    def is_empty(self):
        return len(self.items) == 0
    
    # Return the size of the stack
    def size(self):
        return len(self.items)
    
    # Clear the stack
    def clear(self):
        self.items = []

# Usage
stack = Stack()
stack.push(10)
stack.push(20)
stack.push(30)
print(stack.peek())  # 30
print(stack.pop())   # 30
print(stack.size())  # 2`,
          Java: `// Stack implementation using array
public class Stack {
    private int maxSize;
    private int[] stackArray;
    private int top;
    
    // Constructor
    public Stack(int size) {
        maxSize = size;
        stackArray = new int[maxSize];
        top = -1;
    }
    
    // Push element to the top of the stack
    public void push(int value) {
        if (isFull()) {
            System.out.println("Stack is full");
            return;
        }
        stackArray[++top] = value;
    }
    
    // Remove and return the top element
    public int pop() {
        if (isEmpty()) {
            System.out.println("Stack is empty");
            return -1;
        }
        return stackArray[top--];
    }
    
    // Return the top element without removing it
    public int peek() {
        if (isEmpty()) {
            System.out.println("Stack is empty");
            return -1;
        }
        return stackArray[top];
    }
    
    // Check if stack is empty
    public boolean isEmpty() {
        return (top == -1);
    }
    
    // Check if stack is full
    public boolean isFull() {
        return (top == maxSize - 1);
    }
    
    // Return the size of the stack
    public int size() {
        return top + 1;
    }
}

// Usage
Stack stack = new Stack(10);
stack.push(10);
stack.push(20);
stack.push(30);
System.out.println(stack.peek()); // 30
System.out.println(stack.pop());  // 30
System.out.println(stack.size()); // 2`,
        }}
        information={{
          characteristics: [
            "Follows Last In First Out (LIFO) principle",
            "Elements can only be added or removed from one end (top)",
            "Insertion and deletion operations are performed at the same end",
            "Can be implemented using arrays or linked lists",
            "Has a restricted access pattern - only the top element is accessible",
          ],
          useCases: [
            "Function call management (call stack)",
            "Expression evaluation and syntax parsing",
            "Undo/Redo operations in applications",
            "Backtracking algorithms",
            "Browser history (back button implementation)",
          ],
          timeComplexity: {
            Push: "O(1)",
            Pop: "O(1)",
            Peek: "O(1)",
            Search: "O(n)",
            "Access (other than top)": "O(n)",
          },
          spaceComplexity: "O(n)",
          types: [
            {
              name: "Array-based Stack",
              description:
                "Implemented using arrays. Simple but may need resizing if the stack grows beyond initial capacity.",
            },
            {
              name: "Linked List-based Stack",
              description: "Implemented using linked lists. Dynamically grows but uses extra memory for pointers.",
            },
            {
              name: "Dynamic Stack",
              description:
                "Automatically resizes when capacity is reached, providing flexibility at the cost of occasional O(n) operations.",
            },
          ],
        }}
      />

      <PushDialog />
    </>
  )
}

