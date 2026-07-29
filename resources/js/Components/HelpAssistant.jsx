import { useState, useEffect } from 'react';
import { HelpCircle, X, Search, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { helpCategories, helpTopics } from '@/constants/help';

export default function HelpAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  // Load visibility preference from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('helpAssistantVisible');
    if (stored !== null) {
      setIsVisible(stored === 'true');
    }
  }, []);

  // Save visibility preference
  const toggleVisibility = () => {
    const newVal = !isVisible;
    setIsVisible(newVal);
    localStorage.setItem('helpAssistantVisible', String(newVal));
  };

  // Filter topics based on search and category
  const filteredTopics = helpTopics.filter((topic) => {
    const matchesSearch = topic.question.toLowerCase().includes(search.toLowerCase()) ||
                          topic.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || topic.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!isVisible) {
    // Show a small toggle button to re‑show the assistant
    return (
      <button
        onClick={toggleVisibility}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-navy-700 p-2.5 text-white shadow-lg hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500"
        aria-label="Show help"
      >
        <HelpCircle className="h-5 w-5" />
      </button>
    );
  }

  return (
    <>
     {/* Floating Avatar Button – with video */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-navy-500"
        aria-label="Help"
      >
        <video
          src="/assistant-avatar.mp4" // WebM with alpha
          className="h-14 w-14 rounded-full border-2 border-white object-cover sm:h-14 sm:w-14"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        >
          {/* Fallback: if WebM fails, show an image */}
          <img src="/helpavatar.png" alt="Assistant" className="h-14 w-14 rounded-full object-cover" />
        </video>
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          <HelpCircle className="h-3 w-3" />
        </span>
      </button>

      {/* Full‑screen overlay with blur */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 animate-in fade-in duration-200 sm:p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 sm:max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
             {/* Header – with greeting and proper heading hierarchy */}
<div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
  <div className="flex items-start gap-3">
    <video
      src="/assistant-avatar.mp4"
      className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
    >
      <img src="/assistant-avatar.png" alt="Assistant" className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14" />
    </video>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <h1 className="text-base font-semibold text-slate-800 sm:text-lg">
          Hi, I'm Beejay!
        </h1>
        <span className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-2 py-0.5 text-xs font-medium text-navy-700">
          <MessageCircle className="h-3 w-3" />
          SyntraHR
        </span>
      </div>
      <p className="mt-0.5 text-sm text-slate-500">
        Your Virtual Assistant. I'm here to help you navigate the system and answer frequently asked questions.
      </p>
    </div>
    <button
      onClick={() => setIsOpen(false)}
      className="flex-shrink-0 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      aria-label="Close"
    >
      <X className="h-5 w-5" />
    </button>
  </div>
</div>



            {/* Body */}
            <div className="p-3 sm:p-4">
              {/* Search */}
              <div className="relative mb-3 sm:mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for help..."
                  className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-4 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 sm:py-2"
                  autoFocus
                />
              </div>

              {/* Categories */}
              <div className="mb-3 flex flex-wrap gap-1.5 sm:mb-4">
                {helpCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:py-1 ${
                      activeCategory === cat.id
                        ? 'bg-navy-700 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Topics list */}
              {filteredTopics.length === 0 ? (
                <div className="py-8 text-center text-slate-500">
                  <p className="text-sm">No results found.</p>
                  <p className="mt-1 text-xs">Try a different search or category.</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100 max-h-60 overflow-y-auto sm:max-h-80">
                  {filteredTopics.map((topic) => (
                    <li key={topic.id} className="py-2 first:pt-0 last:pb-0">
                      <button
                        onClick={() => toggleExpand(topic.id)}
                        className="flex w-full items-start justify-between gap-2 text-left text-sm"
                      >
                        <span className="font-medium text-slate-800">{topic.question}</span>
                        {expandedId === topic.id ? (
                          <ChevronUp className="ml-2 h-4 w-4 flex-shrink-0 text-slate-400" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0 text-slate-400" />
                        )}
                      </button>
                      {expandedId === topic.id && (
                        <p className="mt-1 text-sm text-slate-600 leading-relaxed">{topic.answer}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 px-3 py-3 text-center text-xs text-slate-400 sm:px-4">
              Need more help?{' '}
              <a href="/" className="text-navy-600 hover:underline">
                Contact HR
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
