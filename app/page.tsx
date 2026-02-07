import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen grid-background relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-vaporwave-purple/20 via-vaporwave-dark to-vaporwave-darker opacity-90" />
      
      {/* Grid lines animation */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 grid-background opacity-30" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center p-6 md:p-8">
          <div className="flex items-center gap-3">
            <Image 
              src="https://private-us-east-1.manuscdn.com/sessionFile/o4kupod5v9oPEqaV57274n/sandbox/hw5d83zEhZcNkxD5LiW7zS-img-1_1770437710000_na1fn_dnUtbXVzaWMtc2FsYS1sb2dv.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvbzRrdXBvZDV2OW9QRXFhVjU3Mjc0bi9zYW5kYm94L2h3NWQ4M3pFaFpjTmt4RDVMaVc3elMtaW1nLTFfMTc3MDQzNzcxMDAwMF9uYTFmbl9kblV0YlhWemFXTXRjMkZzWVMxc2IyZHYucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=rd4zqo-3eNnP6CoWNAnPN~atiwIkqrUGPB4-CxdoOVd82z2uttMX-o0YtW6rEt-1xAH5svfyocN75eyzj0QYl2pfBp4Re9ostc6CKCwVkx58T6bUW0C1C18w5k9YU2cr7moaIkfnmMIr30hxWP~uVrkhy31wtKSA0h3W8eQokNkErR9crfU~LqLTVijnRD4-o-V3-M3S8w6dkHriRmZ01GetoT5YmW5uxPpo74tHmeV9XFSn5CXEd5CjliDEykHFP7WlB9j9nl467NBbjAL9Ds8Go3ENVkmGish-KCcuGYgMPufjtkgF5ptAG275H0CvAbUpfP7CPPGrqOLHERCBbg__"
              alt="VU Music Sala Logo"
              width={60}
              height={60}
              className="animate-float"
            />
            <span className="text-xl md:text-2xl font-retro font-bold text-neon-cyan neon-text">
              VU MUSIC SALA
            </span>
          </div>
          
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-neon-pink hover:text-neon-cyan transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-neon-pink hover:text-neon-cyan transition-colors">
              About
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-pixel mb-8 animate-glow">
              <span className="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                VUSIC
              </span>
              <br />
              <span className="text-3xl md:text-5xl lg:text-6xl text-neon-cyan">
                IMVU MUSIC BOT
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-12 font-retro">
              VUsic for your IMVU room.
              <br />
              <span className="text-sm md:text-base text-gray-400">
                Immerse yourself in a symphony of code and sound within your IMVU room.
              </span>
            </p>

            <Link 
              href="/dashboard"
              className="inline-block px-12 py-4 text-xl font-retro font-bold bg-gradient-to-r from-neon-pink to-neon-purple rounded-full neon-border border-2 border-neon-pink hover:scale-105 transition-transform duration-300 animate-pulse"
            >
              JOIN NOW
            </Link>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-1/4 left-10 w-20 h-20 border-4 border-neon-cyan rotate-45 animate-float opacity-30" />
          <div className="absolute bottom-1/4 right-10 w-16 h-16 border-4 border-neon-pink rounded-full animate-float opacity-30" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/4 w-12 h-12 border-4 border-neon-purple animate-float opacity-30" style={{ animationDelay: '0.5s' }} />
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-pixel text-center mb-16 text-neon-purple neon-text">
              FEATURES
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "🎵 Music Control",
                  description: "Full control over your IMVU room music with play, pause, skip, and volume controls."
                },
                {
                  title: "📝 Playlists",
                  description: "Create and manage custom playlists for different moods and occasions."
                },
                {
                  title: "🤖 Auto DJ",
                  description: "Let the bot automatically play music based on your preferences and room vibe."
                },
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="p-6 bg-vaporwave-purple/20 backdrop-blur-sm rounded-lg border-2 border-neon-purple/50 hover:border-neon-cyan transition-all duration-300 hover:scale-105"
                >
                  <h3 className="text-2xl font-retro font-bold mb-4 text-neon-cyan">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-neon-purple/30 text-center">
          <p className="text-gray-400 font-retro">
            © 2026 VU Music Sala. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
