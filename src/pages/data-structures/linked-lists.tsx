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

export default function LinkedListsPage() {
  const [linkedList, setLinkedList] = useState<number[]>([10, 20, 30, 40, 50])
  const [newValue, setNewValue] = useState<string>("")
  const [index, setIndex] = useState<string>("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isInsertDialogOpen, setIsInsertDialogOpen] = useState(false)
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [animationState, setAnimationState] = useState<"idle" | "adding" | "inserting" | "removing">("idle")
  const [animationStep, setAnimationStep] = useState<number>(0)
  const [animationMessage, setAnimationMessage] = useState<string>("")
  const [newElement, setNewElement] = useState<number | null>(null)
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([])

  // Reset animation state after completion
  useEffect(() => {
    if (animationState !== "idle" && animationStep > 0) {
      const timer = setTimeout(() => {
        if (animationStep < getMaxSteps()) {
          setAnimationStep(animationStep + 1)
          updateAnimationMessage()
          updateHighlightedIndices()
        } else {
          // Animation complete
          setTimeout(() => {
            setAnimationState("idle")
            setAnimationStep(0)
            setActiveIndex(null)
            setAnimationMessage("")
            setNewElement(null)
            setHighlightedIndices([])
          }, 1000)
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [animationState, animationStep])

  // Get max steps for current animation
  const getMaxSteps = () => {
    switch (animationState) {
      case "adding":
        return 3
      case "inserting":
        return 4
      case "removing":
        return 3
      default:
        return 0
    }
  }

  // Update animation message based on current step
  const updateAnimationMessage = () => {
    const idx = Number.parseInt(index)
   

    switch (animationState) {
      case "adding":
        if (animationStep === 1) {
          setAnimationMessage(`Creating new node with value ${newElement}`)
        } else if (animationStep === 2) {
          setAnimationMessage(`Finding the last node in the list`)
        } else if (animationStep === 3) {
          setAnimationMessage(`Added new node with value ${newElement} to the end of the list`)
        }
        break
      case "inserting":
        if (animationStep === 1) {
          setAnimationMessage(`Creating new node with value ${newElement}`)
        } else if (animationStep === 2) {
          setAnimationMessage(`Traversing to position ${idx}`)
        } else if (animationStep === 3) {
          setAnimationMessage(`Updating next pointers to insert the new node`)
        } else if (animationStep === 4) {
          setAnimationMessage(`Inserted new node with value ${newElement} at position ${idx}`)
        }
        break
      case "removing":
        if (animationStep === 1) {
          setAnimationMessage(`Traversing to position ${idx}`)
        } else if (animationStep === 2) {
          setAnimationMessage(`Updating next pointers to remove the node`)
        } else if (animationStep === 3) {
          setAnimationMessage(`Removed node at position ${idx}`)
        }
        break
    }
  }

  // Update highlighted indices for traversal animation
  const updateHighlightedIndices = () => {
    const idx = Number.parseInt(index)

    switch (animationState) {
      case "adding":
        if (animationStep === 1) {
          setHighlightedIndices([])
        } else if (animationStep === 2) {
          // Simulate traversal to the end
          const traversalIndices = []
          for (let i = 0; i <= linkedList.length - 1; i++) {
            traversalIndices.push(i)
          }
          setHighlightedIndices(traversalIndices)
        }
        break
      case "inserting":
        if (animationStep === 1) {
          setHighlightedIndices([])
        } else if (animationStep === 2) {
          // Simulate traversal to the insertion point
          const traversalIndices = []
          for (let i = 0; i <= idx; i++) {
            traversalIndices.push(i)
          }
          setHighlightedIndices(traversalIndices)
        }
        break
      case "removing":
        if (animationStep === 1) {
          // Simulate traversal to the removal point
          const traversalIndices = []
          for (let i = 0; i <= idx; i++) {
            traversalIndices.push(i)
          }
          setHighlightedIndices(traversalIndices)
        }
        break
    }
  }

  // Linked List operations
  const handleAddToEnd = () => {
    if (newValue.trim() === "") return

    const value = Number.parseInt(newValue)
    if (isNaN(value)) return

    setNewElement(value)
    setAnimationState("adding")
    setAnimationStep(1)
    updateAnimationMessage()

    // Perform actual list update after animation
    setTimeout(() => {
      setLinkedList([...linkedList, value])
    }, 3000)

    setNewValue("")
    setIsAddDialogOpen(false)
  }

  const handleInsert = () => {
    if (newValue.trim() === "" || index.trim() === "") return

    const value = Number.parseInt(newValue)
    const idx = Number.parseInt(index)

    if (isNaN(value) || isNaN(idx) || idx < 0 || idx > linkedList.length) return

    setNewElement(value)
    setAnimationState("inserting")
    setAnimationStep(1)
    setActiveIndex(idx)
    updateAnimationMessage()

    // Perform actual list update after animation
    setTimeout(() => {
      const newList = [...linkedList]
      newList.splice(idx, 0, value)
      setLinkedList(newList)
    }, 4000)

    setNewValue("")
    setIndex("")
    setIsInsertDialogOpen(false)
  }

  const handleRemove = () => {
    if (index.trim() === "") return

    const idx = Number.parseInt(index)
    if (isNaN(idx) || idx < 0 || idx >= linkedList.length) return

    setAnimationState("removing")
    setAnimationStep(1)
    setActiveIndex(idx)
    updateAnimationMessage()

    // Perform actual list update after animation
    setTimeout(() => {
      const newList = [...linkedList]
      newList.splice(idx, 1)
      setLinkedList(newList)
    }, 3000)

    setIndex("")
    setIsRemoveDialogOpen(false)
  }

  const renderLinkedListVisualization = () => {
    return (
      <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 h-full flex flex-col">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Linked List Visualization</h3>

        {animationMessage && (
          <div className="mb-4 p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-md text-center">
            {animationMessage}
          </div>
        )}

        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-wrap gap-2 justify-center">
            {linkedList.map((value, idx) => (
              <div key={idx} className="flex items-center">
                <div
                  className={`
                    w-16 h-16 flex flex-col items-center justify-center rounded-lg border-2
                    ${
                      activeIndex === idx
                        ? animationState === "removing" && animationStep >= 2
                          ? "border-red-500 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 animate-pulse"
                          : "border-purple-500 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 animate-pulse"
                        : highlightedIndices.includes(idx)
                          ? "border-blue-500 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    }
                    ${animationState === "removing" && idx === activeIndex && animationStep === 3 ? "opacity-0" : ""}
                    transition-all duration-300
                  `}
                >
                  <span className="text-lg font-medium">{value}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Node {idx}</span>
                </div>

                {idx < linkedList.length - 1 && (
                  <div className="w-8 h-2 bg-slate-400 dark:bg-slate-600 flex items-center justify-center">
                    <div className="w-2 h-2 border-t-2 border-r-2 border-slate-400 dark:border-slate-600 transform rotate-45"></div>
                  </div>
                )}
              </div>
            ))}

            {linkedList.length > 0 && (
              <div className="w-8 h-16 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-xs text-white">
                  ∅
                </div>
              </div>
            )}

            {/* Show new element being added or inserted */}
            {(animationState === "adding" || animationState === "inserting") &&
              animationStep === 1 &&
              newElement !== null && (
                <div className="absolute -top-16 flex flex-col items-center">
                  <div className="w-16 h-16 flex flex-col items-center justify-center rounded-lg border-2 border-green-500 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 animate-bounce">
                    <span className="text-lg font-medium">{newElement}</span>
                    <span className="text-xs text-green-600 dark:text-green-400">New Node</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                    {animationState === "adding" ? "Will be added to the end" : `Will be inserted at position ${index}`}
                  </div>
                </div>
              )}

            {/* Show new element being inserted at specific position */}
            {animationState === "inserting" && animationStep === 3 && newElement !== null && (
              <div
                className="absolute w-16 h-16 flex flex-col items-center justify-center rounded-lg border-2 border-green-500 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                style={{
                  transform: `translateY(-20px) translateX(${(activeIndex ?? 0) * 76}px)`,
                }}
              >
                <span className="text-lg font-medium">{newElement}</span>
                <span className="text-xs text-green-600 dark:text-green-400">New Node</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 text-center text-slate-600 dark:text-slate-400">
          <p>Linked List Length: {linkedList.length}</p>
          {linkedList.length > 0 ? (
            <p className="text-xs mt-1">
              Head: {linkedList[0]}, Tail: {linkedList[linkedList.length - 1]}
            </p>
          ) : (
            <p className="text-xs mt-1">Linked List is empty</p>
          )}
        </div>
      </div>
    )
  }

  // Add Dialog
  const AddDialog = () => (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Add Node</DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Add a new node to the end of the linked list.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="add-value" className="text-slate-700 dark:text-slate-300">
              Value
            </Label>
            <Input
              id="add-value"
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
            onClick={() => setIsAddDialogOpen(false)}
            className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white"
          >
            Cancel
          </Button>
          <Button onClick={handleAddToEnd} className="bg-purple-600 hover:bg-purple-700">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // Insert Dialog
  const InsertDialog = () => (
    <Dialog open={isInsertDialogOpen} onOpenChange={setIsInsertDialogOpen}>
      <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Insert Node</DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Insert a new node at a specific position.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="insert-value" className="text-slate-700 dark:text-slate-300">
              Value
            </Label>
            <Input
              id="insert-value"
              type="number"
              placeholder="Enter a number"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="insert-index" className="text-slate-700 dark:text-slate-300">
              Position (0 to {linkedList.length})
            </Label>
            <Input
              id="insert-index"
              type="number"
              placeholder="Enter position"
              value={index}
              onChange={(e) => setIndex(e.target.value)}
              min={0}
              max={linkedList.length}
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsInsertDialogOpen(false)}
            className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white"
          >
            Cancel
          </Button>
          <Button onClick={handleInsert} className="bg-purple-600 hover:bg-purple-700">
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // Remove Dialog
  const RemoveDialog = () => (
    <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
      <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Remove Node</DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Remove a node at a specific position.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="remove-index" className="text-slate-700 dark:text-slate-300">
              Position (0 to {linkedList.length - 1})
            </Label>
            <Input
              id="remove-index"
              type="number"
              placeholder="Enter position"
              value={index}
              onChange={(e) => setIndex(e.target.value)}
              min={0}
              max={linkedList.length - 1}
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsRemoveDialogOpen(false)}
            className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white"
          >
            Cancel
          </Button>
          <Button onClick={handleRemove} className="bg-purple-600 hover:bg-purple-700">
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center">Linked Lists</h1>

      <DataStructureVisualizer
        title="Linked List"
        description="A linear data structure where elements are stored in nodes that point to the next node"
        operations={[
          {
            name: "Add to End",
            description: "Add a new node to the end of the linked list",
            action: () => setIsAddDialogOpen(true),
            disabled: animationState !== "idle",
          },
          {
            name: "Insert at Position",
            description: "Insert a new node at a specific position",
            action: () => setIsInsertDialogOpen(true),
            disabled: animationState !== "idle",
          },
          {
            name: "Remove Node",
            description: "Remove a node at a specific position",
            action: () => setIsRemoveDialogOpen(true),
            disabled: linkedList.length === 0 || animationState !== "idle",
          },
        ]}
        renderVisualization={renderLinkedListVisualization}
        codeImplementation={{
          JavaScript: `// Node class
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

// Linked List implementation
class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }
  
  // Add a node to the end of the list
  append(value) {
    const newNode = new Node(value);
    
    // If list is empty, make the new node the head
    if (!this.head) {
      this.head = newNode;
    } else {
      // Traverse to the end of the list
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      
      // Add the new node at the end
      current.next = newNode;
    }
    
    this.size++;
  }
  
  // Insert a node at a specific position
  insertAt(value, position) {
    if (position < 0 || position > this.size) {
      return false;
    }
    
    const newNode = new Node(value);
    
    // Insert at the beginning
    if (position === 0) {
      newNode.next = this.head;
      this.head = newNode;
    } else {
      // Insert at a specific position
      let current = this.head;
      let prev = null;
      let index = 0;
      
      while (index < position) {
        prev = current;
        current = current.next;
        index++;
      }
      
      newNode.next = current;
      prev.next = newNode;
    }
    
    this.size++;
    return true;
  }
  
  // Remove a node at a specific position
  removeAt(position) {
    if (position < 0 || position >= this.size || !this.head) {
      return null;
    }
    
    let current = this.head;
    
    // Remove the first element
    if (position === 0) {
      this.head = current.next;
    } else {
      // Remove at a specific position
      let prev = null;
      let index = 0;
      
      while (index < position) {
        prev = current;
        current = current.next;
        index++;
      }
      
      // Remove the node
      prev.next = current.next;
    }
    
    this.size--;
    return current.value;
  }
  
  // Get the size of the list
  getSize() {
    return this.size;
  }
  
  // Check if the list is empty
  isEmpty() {
    return this.size === 0;
  }
  
  // Print the list
  printList() {
    let current = this.head;
    let result = '';
    
    while (current) {
      result += current.value + ' -> ';
      current = current.next;
    }
    
    return result + 'null';
  }
}

// Usage
const list = new LinkedList();
list.append(10);
list.append(20);
list.append(30);
list.insertAt(15, 1);
console.log(list.printList()); // 10 -> 15 -> 20 -> 30 -> null
list.removeAt(2);
console.log(list.printList()); // 10 -> 15 -> 30 -> null`,
          Python: `# Node class
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

# Linked List implementation
class LinkedList:
    def __init__(self):
        self.head = None
        self.size = 0
    
    # Add a node to the end of the list
    def append(self, value):
        new_node = Node(value)
        
        # If list is empty, make the new node the head
        if not self.head:
            self.head = new_node
        else:
            # Traverse to the end of the list
            current = self.head
            while current.next:
                current = current.next
            
            # Add the new node at the end
            current.next = new_node
        
        self.size += 1
    
    # Insert a node at a specific position
    def insert_at(self, value, position):
        if position < 0 or position > self.size:
            return False
        
        new_node = Node(value)
        
        # Insert at the beginning
        if position == 0:
            new_node.next = self.head
            self.head = new_node
        else:
            # Insert at a specific position
            current = self.head
            prev = None
            index = 0
            
            while index < position:
                prev = current
                current = current.next
                index += 1
            
            new_node.next = current
            prev.next = new_node
        
        self.size += 1
        return True
    
    # Remove a node at a specific position
    def remove_at(self, position):
        if position < 0 or position >= self.size or not self.head:
            return None
        
        current = self.head
        
        # Remove the first element
        if position == 0:
            self.head = current.next
        else:
            # Remove at a specific position
            prev = None
            index = 0
            
            while index < position:
                prev = current
                current = current.next
                index += 1
            
            # Remove the node
            prev.next = current.next
        
        self.size -= 1
        return current.value
    
    # Get the size of the list
    def get_size(self):
        return self.size
    
    # Check if the list is empty
    def is_empty(self):
        return self.size == 0
    
    # Print the list
    def print_list(self):
        current = self.head
        result = ""
        
        while current:
            result += str(current.value) + " -> "
            current = current.next
        
        return result + "None"

# Usage
linked_list = LinkedList()
linked_list.append(10)
linked_list.append(20)
linked_list.append(30)
linked_list.insert_at(15, 1)
print(linked_list.print_list())  # 10 -> 15 -> 20 -> 30 -> None
linked_list.remove_at(2)
print(linked_list.print_list())  # 10 -> 15 -> 30 -> None`,
          Java: `// Node class
class Node {
    int value;
    Node next;
    
    public Node(int value) {
        this.value = value;
        this.next = null;
    }
}

// Linked List implementation
public class LinkedList {
    private Node head;
    private int size;
    
    public LinkedList() {
        this.head = null;
        this.size = 0;
    }
    
    // Add a node to the end of the list
    public void append(int value) {
        Node newNode = new Node(value);
        
        // If list is empty, make the new node the head
        if (head == null) {
            head = newNode;
        } else {
            // Traverse to the end of the list
            Node current = head;
            while (current.next != null) {
                current = current.next;
            }
            
            // Add the new node at the end
            current.next = newNode;
        }
        
        size++;
    }
    
    // Insert a node at a specific position
    public boolean insertAt(int value, int position) {
        if (position < 0 || position > size) {
            return false;
        }
        
        Node newNode = new Node(value);
        
        // Insert at the beginning
        if (position == 0) {
            newNode.next = head;
            head = newNode;
        } else {
            // Insert at a specific position
            Node current = head;
            Node prev = null;
            int index = 0;
            
            while (index < position) {
                prev = current;
                current = current.next;
                index++;
            }
            
            newNode.next = current;
            prev.next = newNode;
        }
        
        size++;
        return true;
    }
    
    // Remove a node at a specific position
    public Integer removeAt(int position) {
        if (position < 0 || position >= size || head == null) {
            return null;
        }
        
        Node current = head;
        
        // Remove the first element
        if (position == 0) {
            head = current.next;
        } else {
            // Remove at a specific position
            Node prev = null;
            int index = 0;
            
            while (index < position) {
                prev = current;
                current = current.next;
                index++;
            }
            
            // Remove the node
            prev.next = current.next;
        }
        
        size--;
        return current.value;
    }
    
    // Get the size of the list
    public int getSize() {
        return size;
    }
    
    // Check if the list is empty
    public boolean isEmpty() {
        return size == 0;
    }
    
    // Print the list
    public String printList() {
        Node current = head;
        StringBuilder result = new StringBuilder();
        
        while (current != null) {
            result.append(current.value).append(" -> ");
            current = current.next;
        }
        
        result.append("null");
        return result.toString();
    }
}

// Usage
LinkedList list = new LinkedList();
list.append(10);
list.append(20);
list.append(30);
list.insertAt(15, 1);
System.out.println(list.printList()); // 10 -> 15 -> 20 -> 30 -> null
list.removeAt(2);
System.out.println(list.printList()); // 10 -> 15 -> 30 -> null`,
        }}
        information={{
          characteristics: [
            "Dynamic data structure that can grow or shrink during execution",
            "Elements (nodes) are not stored in contiguous memory locations",
            "Each node contains data and a reference to the next node",
            "Efficient for insertions and deletions",
            "Inefficient for random access of elements",
          ],
          useCases: [
            "Implementation of stacks and queues",
            "Dynamic memory allocation",
            "Representation of sparse matrices",
            "Hash tables (for handling collisions)",
            "Adjacency lists for graphs",
          ],
          timeComplexity: {
            Access: "O(n)",
            Search: "O(n)",
            "Insert at beginning": "O(1)",
            "Insert at end": "O(n) or O(1) with tail pointer",
            "Insert at position": "O(n)",
            "Delete at beginning": "O(1)",
            "Delete at end": "O(n) or O(1) with tail pointer",
            "Delete at position": "O(n)",
          },
          spaceComplexity: "O(n)",
          types: [
            {
              name: "Singly Linked List",
              description:
                "Each node has data and a reference to the next node. Traversal is only possible in one direction.",
            },
            {
              name: "Doubly Linked List",
              description:
                "Each node has data and references to both the next and previous nodes. Allows traversal in both directions.",
            },
            {
              name: "Circular Linked List",
              description:
                "The last node points back to the first node, creating a circle. Can be singly or doubly linked.",
            },
            {
              name: "Circular Doubly Linked List",
              description:
                "Combines features of both circular and doubly linked lists. Each node has references to both next and previous nodes, and the last node points back to the first.",
            },
          ],
        }}
      />

      <AddDialog />
      <InsertDialog />
      <RemoveDialog />
    </>
  )
}

