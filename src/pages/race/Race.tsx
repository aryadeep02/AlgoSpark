import AlgorithmRace from "./algorithm-race"

export default function race() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-black dark:to-black py-8 mt-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center">
          Algorithm Race Mode
        </h1>
        <AlgorithmRace />
      </div>
    </div>
  )
}

