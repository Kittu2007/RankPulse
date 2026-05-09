import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    // Simulate sending
    setTimeout(() => {
      setLoading(false);
      setName("");
      setEmail("");
      setMessage("");
      toast.success("Message sent! We will get back to you shortly.");
    }, 1000);
  };

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black uppercase mb-4" style={{ fontFamily: "var(--font-d)" }}>
            Get in Touch
          </h1>
          <p className="text-lg font-bold text-[#555]">
            Have a question or want to upgrade to Enterprise? Drop us a line.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="border-2 border-[var(--black)] bg-white shadow-[12px_12px_0_var(--black)] p-8 md:p-12">
          <div className="flex flex-col gap-6">
            <div>
              <label className="label-sm mb-2 block">Name</label>
              <input 
                type="text" 
                className="input" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Your Name" 
              />
            </div>
            <div>
              <label className="label-sm mb-2 block">Email</label>
              <input 
                type="email" 
                className="input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="you@example.com" 
              />
            </div>
            <div>
              <label className="label-sm mb-2 block">Message</label>
              <textarea 
                className="input min-h-[150px] resize-none" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="How can we help?" 
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-red w-full justify-center h-12 text-base mt-2"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
