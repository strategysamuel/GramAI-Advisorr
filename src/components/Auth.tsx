import { auth } from "../lib/firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { LogIn, LogOut, User } from "lucide-react";

export function Auth() {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const login = () => signInWithPopup(auth, new GoogleAuthProvider());
  const logout = () => signOut(auth);

  const selectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <button 
          onClick={selectKey}
          className="hidden lg:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all border border-white/20"
        >
          API Key
        </button>
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-2 px-4 rounded-full border border-white/20">
        <div className="flex items-center gap-2">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || ""} className="w-8 h-8 rounded-full border border-white/50" referrerPolicy="no-referrer" />
          ) : (
            <User className="w-8 h-8 p-1 bg-gray-200 rounded-full" />
          )}
          <span className="text-sm font-medium text-white hidden sm:inline">{user.displayName}</span>
        </div>
        <button onClick={logout} className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white" title="Logout">
          <LogOut className="w-5 h-5" />
        </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="flex items-center gap-2 bg-white text-emerald-700 px-6 py-2.5 rounded-full font-semibold hover:bg-emerald-50 transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
    >
      <LogIn className="w-5 h-5" />
      Sign in with Google
    </button>
  );
}
