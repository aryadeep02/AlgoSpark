
import { Info, Mail, Github, Linkedin, Twitter, Instagram } from "lucide-react";
import {  toast } from "sonner";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function Footer() {
  const showComingSoonToast = (event: React.MouseEvent) => {
    event.preventDefault();
    toast.success("Coming Soon!", {
      icon: <Info className="h-5 w-5 text-blue-500" />,
      duration: 2500,
      style: {
        borderRadius: "12px",
        border: "1px solid rgba(59, 130, 246, 0.5)",
        background: "white",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        padding: "12px",
        fontWeight: "500",
      },
    });
  };

  return (
    <>
      <footer className="bg-white dark:bg-black border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                © {new Date().getFullYear()} AlGo SpArK. All rights reserved.
              </p>
            </div>

            <div className="flex space-x-6">
              <a href="https://github.com/aryadeep02" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400">
                GitHub
              </a>
              <a onClick={(event) => showComingSoonToast(event)} className="cursor-pointer text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400">
                Documentation
              </a>

              {/* Contact Popup Trigger */}
              <Dialog>
                <DialogTrigger asChild>
                  <span className="cursor-pointer text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400">
                    Contact
                  </span>
                </DialogTrigger>
                <DialogContent className="max-w-sm p-6 bg-white dark:bg-black shadow-lg rounded-xl">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">👋 Contact Me</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                      I'm <strong>Aryadeep Varshney</strong>, the developer of Algo Spark Website. Connect with me:
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex flex-col space-y-4 mt-3">
                    <a href="mailto:aryadeepvarshney85@gmail.com" className="flex items-center space-x-2 hover:text-purple-600 transition">
                      <Mail className="h-5 w-5" />
                      <span>Email: aryadeepvarshney85@gmail.com</span>
                    </a>
                    <a href="https://github.com/aryadeep02" className="flex items-center space-x-2 hover:text-purple-600 transition">
                      <Github className="h-5 w-5" />
                      <span>GitHub</span>
                    </a>
                    <a href="https://www.linkedin.com/in/aryadeep21/" className="flex items-center space-x-2 hover:text-purple-600 transition">
                      <Linkedin className="h-5 w-5" />
                      <span>LinkedIn</span>
                    </a>
                    <a href="https://x.com/aryadeep22" className="flex items-center space-x-2 hover:text-purple-600 transition">
                      <Twitter className="h-5 w-5" />
                      <span>Twitter</span>
                    </a>
                    <a href="https://www.instagram.com/aryadeep_v22/" className="flex items-center space-x-2 hover:text-purple-600 transition">
                      <Instagram className="h-5 w-5" />
                      <span>Instagram</span>
                    </a>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
