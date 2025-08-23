

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CustomInputProps {
  onSubmit: (input: number[]) => void
  onSearchTargetChange: (target: number) => void
  algorithmType: string
  disabled: boolean
}

export default function CustomInput({ onSubmit, onSearchTargetChange, algorithmType, disabled }: CustomInputProps) {
  const [inputText, setInputText] = useState("")
  const [searchTarget, setSearchTarget] = useState("")
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)

  const handleSubmit = () => {
    try {
      // Parse input text to array of numbers
      const inputArray = inputText
        .split(/[,\s]+/)
        .filter((item) => item.trim() !== "")
        .map((item) => {
          const num = Number.parseInt(item.trim())
          if (isNaN(num)) {
            throw new Error(`Invalid number: ${item}`)
          }
          return num
        })

      if (inputArray.length < 2) {
        throw new Error("Please enter at least 2 numbers")
      }

      if (inputArray.length > 100) {
        throw new Error("Maximum array size is 100")
      }

      // If searching, validate search target
      if (algorithmType === "searching" && searchTarget.trim() !== "") {
        const target = Number.parseInt(searchTarget.trim())
        if (isNaN(target)) {
          throw new Error("Search target must be a valid number")
        }
        onSearchTargetChange(target)
      } else if (algorithmType === "searching") {
        // If no search target provided, use a random element from the array
        const randomIndex = Math.floor(Math.random() * inputArray.length)
        onSearchTargetChange(inputArray[randomIndex])
      }

      onSubmit(inputArray)
      setError("")
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid input")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          disabled={disabled}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Custom Input
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
        <DialogHeader>
          <DialogTitle>Custom Input</DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Enter comma or space-separated numbers for your custom array.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Array Elements</label>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g., 5, 2, 9, 1, 5, 6"
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          {algorithmType === "searching" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Search Target (optional)</label>
              <Input
                value={searchTarget}
                onChange={(e) => setSearchTarget(e.target.value)}
                placeholder="e.g., 5"
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                If not specified, a random element from the array will be used.
              </p>
            </div>
          )}

          {error && (
            <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-400 text-sm">{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700">
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

