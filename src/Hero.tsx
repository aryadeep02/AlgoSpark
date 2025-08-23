import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Zap } from "lucide-react";


export default function Hero() {



  const scrollToSection = () => {
    const target = document.getElementById("algorithms");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 " />
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="inline-block rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 px-3 py-1 text-sm font-medium text-white mb-6">
            Interactive Learning
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent 
              bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 
              dark:from-blue-400 dark:via-teal-300 dark:to-cyan-500">
              Visualize
            </span>{" "}
            Data Structures & Algorithms
          </h1>
          <p className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mb-10">
            Explore, understand, and master algorithms through interactive visualizations. Compare algorithm performance
            in real-time with our unique Race Mode.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
                dark:from-blue-500 dark:to-teal-500 dark:hover:from-blue-600 dark:hover:to-teal-600"
            >
              <Link to="/race" className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Try Race Mode
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white 
                hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div onClick={scrollToSection} className="flex items-center gap-2">
                <Code2  className="h-5 w-5" />
                Explore Algorithms
                <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
