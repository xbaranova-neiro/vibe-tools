import { VibeStudio } from "@/components/VibeStudio";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070f]">
      <div className="landing-bg pointer-events-none fixed inset-0" aria-hidden />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-[32rem] w-[32rem] rounded-full bg-violet-600/20 blur-[100px]" />
        <div
          className="absolute -right-32 bottom-0 h-[32rem] w-[32rem] rounded-full bg-fuchsia-600/15 blur-[100px]"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute left-1/2 top-[20%] h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/[0.07] blur-[80px]" />
      </div>
      <div className="relative z-10">
        <VibeStudio />
      </div>
    </main>
  );
}
