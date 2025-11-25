import { useState } from "react";
import { Home as HomeIcon, Search, Heart, User } from "lucide-react";
import { Home } from "./components/Home";
import { Search as SearchPage } from "./components/Search";
import { Profile } from "./components/Profile";
import { Activity } from "./components/Activity";

type Tab = "home" | "search" | "activity" | "profile";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-2xl font-semibold">Foodstagram</h1>
      </header>

      {/* Content */}
      <main className="bg-white">
        {activeTab === "home" && <Home />}
        {activeTab === "search" && <SearchPage />}
        {activeTab === "activity" && <Activity />}
        {activeTab === "profile" && <Profile />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => setActiveTab("home")}
            className={`p-2 ${activeTab === "home" ? "text-black" : "text-gray-400"}`}
          >
            <HomeIcon className="w-6 h-6" />
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`p-2 ${activeTab === "search" ? "text-black" : "text-gray-400"}`}
          >
            <Search className="w-6 h-6" />
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`p-2 ${activeTab === "activity" ? "text-black" : "text-gray-400"}`}
          >
            <Heart className="w-6 h-6" />
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`p-2 ${activeTab === "profile" ? "text-black" : "text-gray-400"}`}
          >
            <User className="w-6 h-6" />
          </button>
        </div>
      </nav>
    </div>
  );
}