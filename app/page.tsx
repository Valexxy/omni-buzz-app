import NewsDeck from './components/NewsDeck';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="py-16 px-6 text-center border-b border-white/5">
        <h1 className="text-6xl font-black tracking-tighter italic italic uppercase">
          OMNI-BUZZ <span className="text-cyan-500 text-5xl">2026</span>
        </h1>
        <p className="text-zinc-500 font-mono mt-4 text-[10px] uppercase tracking-[0.4em]">
          Automated Intelligence • Instance_01 • Abuja
        </p>
      </header>
      
      <section className="max-w-7xl mx-auto py-10">
        <NewsDeck />
      </section>

      <footer className="p-10 text-center text-[9px] font-mono text-zinc-800 tracking-[0.5em] uppercase">
        End of Transmission
      </footer>
    </main>
  );
}