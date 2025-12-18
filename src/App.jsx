import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PawPrint, RefreshCcw, Moon, Sun, Download } from "lucide-react";

export default function App() {
  const [dogImage, setDogImage] = useState(null);
  const [breed, setBreed] = useState("");
  const [dogName, setDogName] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);

  // Helper to format breed nicely
  const formatBreed = (rawBreed) => {
    return rawBreed
      .replace(/[_-]/g, " ")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  // Fetch dog image + breed + name
  const fetchDog = async () => {
    setLoading(true);
    try {
      // Dog image
      const imgRes = await fetch("https://dog.ceo/api/breeds/image/random");
      const imgData = await imgRes.json();

      const imageUrl = imgData.message;
      const rawBreed = imageUrl.split("/breeds/")[1].split("/")[0];
      setDogImage(imageUrl);
      setBreed(formatBreed(rawBreed));

      // Dog name
      const nameRes = await fetch("https://randomuser.me/api/?inc=name");
      const nameData = await nameRes.json();
      setDogName(nameData.results[0].name.first);
    } catch (err) {
      console.error(err);
      setDogName("Buddy"); // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDog();
  }, []);

  // Fix for download filename (Babel-safe)
  const fileName = dogName ? `${dogName}.jpg` : "dog.jpg";

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen flex items-center justify-center p-6 transition-colors duration-500 bg-gradient-to-br from-indigo-200 to-pink-200 dark:from-gray-900 dark:to-black">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-full max-w-md p-6 rounded-3xl bg-white/40 dark:bg-white/10 backdrop-blur-2xl shadow-xl"
        >
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/40 dark:bg-black/40"
          >
            {dark ? <Sun /> : <Moon />}
          </button>

          {/* Website Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold dark:text-white flex items-center justify-center gap-2">
              🐶 PawFetch
            </h1>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              Animated Random Dog Generator
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Fetch random dog images, names, and breeds from public APIs with smooth animations, dark/light mode, and download support.
            </p>
          </div>

          {/* Dog Name & Breed */}
          <div className="text-center dark:text-white mb-4">
            <p className="font-semibold">{dogName || "Fetching name..."}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Breed: {breed || "Unknown"}
            </p>
          </div>

          {/* Dog Image */}
          <div className="mt-4 h-64 rounded-2xl overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loader"
                  className="h-12 w-12 border-4 border-pink-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              ) : (
                <motion.img
                  key={dogImage}
                  src={dogImage}
                  alt="Dog"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="h-full w-full object-cover rounded-2xl"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchDog}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-xl"
            >
              <RefreshCcw size={18} /> New Dog
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href={dogImage}
              download={fileName}
              className="p-2 rounded-xl bg-green-500 text-white flex items-center justify-center"
            >
              <Download />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
