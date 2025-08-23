import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faGithub,
  faLinkedin,
  faXTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const About = ()=> {
  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg text-white">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">
            About Algo Spark
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-center">
            Algo Spark is an interactive learning tool designed to help
            students, developers, and professionals grasp complex Data Structures 
            and Algorithms (DSA) with real-time visualizations.  
          </p>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Features Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-600">Key Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-slate-700 dark:text-slate-300">
            <li>✅ Visualizes Sorting, Searching, Graph, and DP Algorithms</li>
            <li>✅ Step-by-step animations for enhanced understanding</li>
            <li>✅ Interactive controls to play, pause, and reset visualizations</li>
            <li>✅ Dark mode support for a seamless coding experience</li>
            <li>✅ User-friendly interface with ShadCN UI components</li>
          </ul>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Future Enhancements */}
      <Card className="shadow-md border-l-4 border-purple-500">
        <CardHeader>
          <CardTitle className="text-xl text-purple-600">✨ Future Enhancements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-slate-700 dark:text-slate-300">
            <li>🚀 AI-powered suggestions for next best steps</li>
            <li>🎨 Customizable themes and colors</li>
            <li>📈 More algorithm visualizations (Trie, AVL Tree, etc.)</li>
            <li>🌍 Multiplayer mode for coding competitions</li>
          </ul>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Developer Info */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-600">👨‍💻 About the Developer</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg text-slate-700 dark:text-slate-300">
            This project was developed by Aryadeep Varshney, an Aspiring AI Engineer
            passionate about Web3, Machine Learning and Front-End Development.
          </p>

          <div className="mt-6 flex justify-center space-x-4 text-2xl">
          <Button variant="ghost" asChild>
  <a
    href="https://github.com/aryadeep02"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="GitHub"
  >
    <FontAwesomeIcon icon={faGithub} className="text-gray-800 dark:text-white" />
  </a>
</Button>
<Button variant="ghost" asChild>
  <a
    href="https://www.linkedin.com/in/aryadeep21/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
  >
    <FontAwesomeIcon icon={faLinkedin} className="text-blue-600 dark:text-blue-400" />
  </a>
</Button>
<Button variant="ghost" asChild>
  <a
    href="https://x.com/aryadeep22"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Twitter / X"
  >
    <FontAwesomeIcon icon={faXTwitter} className="text-gray-500 dark:text-gray-300" />
  </a>
</Button>
<Button variant="ghost" asChild>
  <a
    href="https://www.instagram.com/aryadeep_v22/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
  >
    <FontAwesomeIcon icon={faInstagram} className="text-pink-500 dark:text-pink-400" />
  </a>
</Button>

          </div>
        </CardContent>
      </Card>
    </section>
  );
}
export default About;