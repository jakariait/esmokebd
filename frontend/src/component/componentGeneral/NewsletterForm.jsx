import { useState } from "react";
import useNewsletterStore from "../../store/useNewsletterStore.js"; // Adjust the path as needed

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { subscribe, isLoading, error } = useNewsletterStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email.trim()) {
      setMessage("Please enter an email.");
      return;
    }

    // Await the subscribe call and get a success boolean
    const success = await subscribe(email);

    if (success) {
      setMessage("✅ Successfully subscribed!");
      setEmail("");
    } else {
      // Use the updated error from the store if available
      setMessage(`❌ ${error || "Subscription failed"}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5">
      <input
        type="email"
        placeholder="Email Address"
        className="bg-white w-full p-2 focus:outline-none text-black border border-gray-300"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        type="submit"
        className="w-full secondaryBgColor accentTextColor p-3 mt-5 hover:bg-green-600 transition cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? "Subscribing..." : "Subscribe"}
      </button>
      {message && <p className="mt-3 text-sm text-center">{message}</p>}
    </form>
  );
}
