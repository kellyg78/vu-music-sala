"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Room {
  id: number;
  name: string;
  status: "online" | "offline";
  currentSong: string;
  listeners: number;
}

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, name: "Chill Lounge", status: "online", currentSong: "Synthwave Dreams", listeners: 12 },
    { id: 2, name: "Party Zone", status: "online", currentSong: "Neon Nights", listeners: 25 },
    { id: 3, name: "VIP Room", status: "offline", currentSong: "---", listeners: 0 },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [playlist, setPlaylist] = useState<Song[]>([
    { id: 1, title: "Synthwave Dreams", artist: "Retro Wave", duration: "3:45" },
    { id: 2, title: "Neon Nights", artist: "Cyber Pulse", duration: "4:12" },
    { id: 3, title: "Digital Love", artist: "Vaporwave Collective", duration: "3:58" },
  ]);

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.push("/");
  };

  return (
    <main className="min-h-screen grid-background relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-vaporwave-purple/20 via-vaporwave-dark to-vaporwave-darker opacity-90" />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-neon-purple/30 bg-vaporwave-darker/50 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image 
                src="https://private-us-east-1.manuscdn.com/sessionFile/o4kupod5v9oPEqaV57274n/sandbox/hw5d83zEhZcNkxD5LiW7zS-img-1_1770437710000_na1fn_dnUtbXVzaWMtc2FsYS1sb2dv.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvbzRrdXBvZDV2OW9QRXFhVjU3Mjc0bi9zYW5kYm94L2h3NWQ4M3pFaFpjTmt4RDVMaVc3elMtaW1nLTFfMTc3MDQzNzcxMDAwMF9uYTFmbl9kblV0YlhWemFXTXRjMkZzWVMxc2IyZHYucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=rd4zqo-3eNnP6CoWNAnPN~atiwIkqrUGPB4-CxdoOVd82z2uttMX-o0YtW6rEt-1xAH5svfyocN75eyzj0QYl2pfBp4Re9ostc6CKCwVkx58T6bUW0C1C18w5k9YU2cr7moaIkfnmMIr30hxWP~uVrkhy31wtKSA0h3W8eQokNkErR9crfU~LqLTVijnRD4-o-V3-M3S8w6dkHriRmZ01GetoT5YmW5uxPpo74tHmeV9XFSn5CXEd5CjliDEykHFP7WlB9j9nl467NBbjAL9Ds8Go3ENVkmGish-KCcuGYgMPufjtkgF5ptAG275H0CvAbUpfP7CPPGrqOLHERCBbg__"
                alt="VU Music Sala"
                width={40}
                height={40}
              />
              <span className="text-xl font-retro font-bold text-neon-cyan">Dashboard</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-neon-pink/20 border border-neon-pink rounded-lg font-retro text-neon-pink hover:bg-neon-pink/30 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-pixel text-neon-cyan neon-text mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-400 font-retro">
              Manage your IMVU room music bots from here
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Active Rooms */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-vaporwave-purple/20 backdrop-blur-lg rounded-xl p-6 border-2 border-neon-purple/50">
                <h2 className="text-2xl font-retro font-bold text-neon-pink mb-4">
                  🏠 Your Rooms
                </h2>
                <div className="space-y-4">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className="bg-vaporwave-darker/50 rounded-lg p-4 border border-neon-cyan/30 hover:border-neon-cyan transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-retro font-bold text-white text-lg">
                            {room.name}
                          </h3>
                          <p className="text-sm text-gray-400 font-retro">
                            {room.currentSong}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-retro ${
                            room.status === "online"
                              ? "bg-neon-green/20 text-neon-green border border-neon-green"
                              : "bg-gray-500/20 text-gray-400 border border-gray-500"
                          }`}
                        >
                          {room.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-sm text-gray-400 font-retro">
                          👥 {room.listeners} listeners
                        </span>
                        {room.status === "online" && (
                          <div className="flex gap-2 ml-auto">
                            <button className="p-2 bg-neon-cyan/20 border border-neon-cyan rounded text-neon-cyan hover:bg-neon-cyan/30 transition-colors">
                              ⏸
                            </button>
                            <button className="p-2 bg-neon-cyan/20 border border-neon-cyan rounded text-neon-cyan hover:bg-neon-cyan/30 transition-colors">
                              ⏭
                            </button>
                            <button className="p-2 bg-neon-pink/20 border border-neon-pink rounded text-neon-pink hover:bg-neon-pink/30 transition-colors">
                              ⚙️
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-3 bg-gradient-to-r from-neon-pink to-neon-purple rounded-lg font-retro font-bold text-white border-2 border-neon-pink hover:scale-105 transition-transform">
                  + Add New Room
                </button>
              </div>

              {/* Music Search */}
              <div className="bg-vaporwave-purple/20 backdrop-blur-lg rounded-xl p-6 border-2 border-neon-purple/50">
                <h2 className="text-2xl font-retro font-bold text-neon-pink mb-4">
                  🔍 Search Music
                </h2>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for songs, artists..."
                  className="w-full px-4 py-3 bg-vaporwave-darker/50 border-2 border-neon-purple/30 rounded-lg text-white font-retro focus:border-neon-cyan focus:outline-none transition-colors mb-4"
                />
                <div className="space-y-2">
                  {playlist.filter(song => 
                    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((song) => (
                    <div
                      key={song.id}
                      className="flex justify-between items-center bg-vaporwave-darker/50 rounded-lg p-3 border border-neon-purple/30 hover:border-neon-cyan transition-colors"
                    >
                      <div>
                        <p className="font-retro text-white">{song.title}</p>
                        <p className="text-sm text-gray-400 font-retro">{song.artist}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400 font-retro">{song.duration}</span>
                        <button className="px-3 py-1 bg-neon-cyan/20 border border-neon-cyan rounded text-neon-cyan hover:bg-neon-cyan/30 transition-colors text-sm font-retro">
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="bg-vaporwave-purple/20 backdrop-blur-lg rounded-xl p-6 border-2 border-neon-purple/50">
                <h2 className="text-xl font-retro font-bold text-neon-cyan mb-4">
                  📊 Stats
                </h2>
                <div className="space-y-4">
                  <div className="bg-vaporwave-darker/50 rounded-lg p-4 border border-neon-pink/30">
                    <p className="text-sm text-gray-400 font-retro">Total Rooms</p>
                    <p className="text-3xl font-pixel text-neon-pink">{rooms.length}</p>
                  </div>
                  <div className="bg-vaporwave-darker/50 rounded-lg p-4 border border-neon-cyan/30">
                    <p className="text-sm text-gray-400 font-retro">Active Listeners</p>
                    <p className="text-3xl font-pixel text-neon-cyan">
                      {rooms.reduce((sum, room) => sum + room.listeners, 0)}
                    </p>
                  </div>
                  <div className="bg-vaporwave-darker/50 rounded-lg p-4 border border-neon-purple/30">
                    <p className="text-sm text-gray-400 font-retro">Songs in Queue</p>
                    <p className="text-3xl font-pixel text-neon-purple">{playlist.length}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-vaporwave-purple/20 backdrop-blur-lg rounded-xl p-6 border-2 border-neon-purple/50">
                <h2 className="text-xl font-retro font-bold text-neon-cyan mb-4">
                  ⚡ Quick Actions
                </h2>
                <div className="space-y-3">
                  <button className="w-full py-2 bg-neon-pink/20 border border-neon-pink rounded-lg font-retro text-neon-pink hover:bg-neon-pink/30 transition-colors">
                    Create Playlist
                  </button>
                  <button className="w-full py-2 bg-neon-cyan/20 border border-neon-cyan rounded-lg font-retro text-neon-cyan hover:bg-neon-cyan/30 transition-colors">
                    Import Songs
                  </button>
                  <button className="w-full py-2 bg-neon-purple/20 border border-neon-purple rounded-lg font-retro text-neon-purple hover:bg-neon-purple/30 transition-colors">
                    Bot Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
