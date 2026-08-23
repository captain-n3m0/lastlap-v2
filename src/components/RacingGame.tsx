/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { GAME_BIKES } from '../data/mockData';
import { ShieldCheck, Timer, Trophy, Coins, Play, RefreshCw, CheckCircle2, Award, Zap, Activity } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function RacingGame() {
  const [selectedBikeId, setSelectedBikeId] = useState<number>(3); // Default Apex
  const [wager, setWager] = useState<string>('0.05');
  const [timerSeconds, setTimerSeconds] = useState<number>(45);
  const [currentRound, setCurrentRound] = useState<number>(14289);
  const [gameState, setGameState] = useState<'betting' | 'racing' | 'result'>('betting');
  const [winningBikeId, setWinningBikeId] = useState<number | null>(null);
  const [hashSeed, setHashSeed] = useState<string>('0x7f9a882e9b04f7a1c3d2e5a6f8b901c234de56fa');
  const [playerWon, setPlayerWon] = useState<boolean | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerLineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tickerBadgesRef = useRef<HTMLDivElement>(null);
  const arenaRef = useRef<HTMLDivElement>(null);
  const bikeMatrixRef = useRef<HTMLDivElement>(null);
  const pastResultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Header Reveal
      if (headerRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        if (headerLineRef.current) {
          tl.fromTo(
            headerLineRef.current,
            { width: 0, opacity: 0 },
            { width: 48, opacity: 1, duration: 0.6, ease: 'power2.out' }
          );
        }

        if (titleRef.current) {
          tl.fromTo(
            titleRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
            '-=0.3'
          );
        }

        if (tickerBadgesRef.current) {
          tl.fromTo(
            tickerBadgesRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
            '-=0.6'
          );
        }
      }

      // 2. Main Arena Box Reveal
      if (arenaRef.current) {
        gsap.fromTo(
          arenaRef.current,
          { y: 60, opacity: 0, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: arenaRef.current,
              start: 'top 82%',
            },
          }
        );
      }

      // 3. Bike Matrix Buttons Stagger
      if (bikeMatrixRef.current) {
        gsap.fromTo(
          bikeMatrixRef.current.children,
          { opacity: 0, y: 25, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: bikeMatrixRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // 4. Past Results Ledger Cards Reveal
      if (pastResultsRef.current) {
        gsap.fromTo(
          pastResultsRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: pastResultsRef.current,
              start: 'top 88%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 45-second live countdown loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          triggerRace();
          return 45;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedBikeId, wager]);

  const triggerRace = () => {
    setGameState('racing');
    const randomWinner = Math.floor(Math.random() * 10) + 1;
    setWinningBikeId(randomWinner);

    const hexChars = '0123456789abcdef';
    let newHash = '0x';
    for (let i = 0; i < 40; i++) {
      newHash += hexChars[Math.floor(Math.random() * hexChars.length)];
    }
    setHashSeed(newHash);

    setTimeout(() => {
      setGameState('result');
      setPlayerWon(randomWinner === selectedBikeId);
      setCurrentRound((prev) => prev + 1);

      setTimeout(() => {
        setGameState('betting');
        setPlayerWon(null);
      }, 5000);
    }, 3500);
  };

  const handleManualEnter = () => {
    if (gameState === 'betting') {
      triggerRace();
    }
  };

  const selectedBike = GAME_BIKES.find((b) => b.id === selectedBikeId) || GAME_BIKES[0];
  const potentialPayout = (parseFloat(wager || '0') * parseFloat(selectedBike.odds.replace('x', ''))).toFixed(3);

  const pastResults = [
    { round: currentRound - 1, winner: 'Apex #0017 (Rig #3)', prize: '0.84 ETH', pool: '2,500 LAP' },
    { round: currentRound - 2, winner: 'Dune Strider (Rig #1)', prize: '1.28 ETH', pool: '3,800 LAP' },
    { round: currentRound - 3, winner: 'Wild Card (Rig #5)', prize: '2.72 ETH', pool: '7,400 LAP + NFT' },
  ];

  return (
    <section
      ref={sectionRef}
      id="game"
      className="py-32 sm:py-44 bg-[#080808] relative border-b border-white/10 text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Masthead Header */}
        <div ref={headerRef} className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-mono font-bold tracking-[0.3em] text-white/50 uppercase">
                CHAPTER 03 // LIVE CIRCUIT ENGINE
              </span>
              <div ref={headerLineRef} className="h-[1px] w-12 bg-white/20 origin-left"></div>
              <span className="text-[11px] font-mono text-amber-400 tracking-widest uppercase flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                ROUND #{currentRound}
              </span>
            </div>

            <h2
              ref={titleRef}
              className="text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight leading-[0.9]"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              ENTER THE
              <br />
              <span className="text-stroke-white text-transparent hover:text-white transition-colors duration-300">
                FINAL LAP.
              </span>
            </h2>
          </div>

          {/* Real-time Ticker & Provably Fair telemetry badge */}
          <div ref={tickerBadgesRef} className="flex flex-wrap items-center gap-4">
            <div className="px-6 py-4 rounded-2xl bg-zinc-950 border border-white/15 flex items-center gap-4 shadow-xl">
              <Timer className="w-6 h-6 text-red-400 animate-pulse" />
              <div>
                <span className="text-[10px] font-mono text-white/50 block tracking-widest uppercase">NEXT HEAT IN</span>
                <span className="text-2xl font-mono font-black text-white">
                  00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}s
                </span>
              </div>
            </div>

            <div className="hidden sm:flex px-6 py-4 rounded-2xl bg-zinc-950 border border-emerald-500/30 items-center gap-4 shadow-xl">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold block tracking-widest uppercase">PROVABLY FAIR</span>
                <span className="text-xs font-mono text-white/80 truncate max-w-[140px] block">
                  {hashSeed.slice(0, 14)}...
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Arena Box */}
        <div
          ref={arenaRef}
          className="p-6 sm:p-12 rounded-3xl bg-zinc-950 shadow-2xl mb-16"
        >
          {/* Status Display Strip */}
          <div className="mb-8 p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className={`w-3 h-3 rounded-full ${
                  gameState === 'racing'
                    ? 'bg-amber-400 animate-ping'
                    : gameState === 'result'
                    ? 'bg-emerald-400'
                    : 'bg-emerald-400 animate-pulse'
                }`}
              ></span>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-white">
                {gameState === 'betting' && 'GRID OPEN FOR ENTRY — SELECT RIG & COMMIT STAKE'}
                {gameState === 'racing' && 'SIMULATING FINAL LAP TELEMETRY & ENGINE THRUST...'}
                {gameState === 'result' && 'HEAT CONCLUDED — DISBURSING ONCHAIN POOL'}
              </span>
            </div>

            <span className="text-xs font-mono text-white/50 tracking-wider">
              CIRCUIT 01 // SECTOR APEX
            </span>
          </div>

          {/* 10-Grid Bike Selector Matrix */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-white/70">
                1. SELECT YOUR CONTENDER (10 RUNNERS)
              </span>
              <span className="text-xs font-mono text-white/40">ODDS BASED ON WEIGHT & GRIP</span>
            </div>

            <div ref={bikeMatrixRef} className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
              {GAME_BIKES.map((bike) => {
                const isSelected = selectedBikeId === bike.id;
                const isWinner = winningBikeId === bike.id && gameState === 'result';
                return (
                  <button
                    key={bike.id}
                    type="button"
                    disabled={gameState !== 'betting'}
                    onClick={() => setSelectedBikeId(bike.id)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer relative overflow-hidden ${
                      isWinner
                        ? 'border-emerald-400 bg-emerald-950/50 scale-105 shadow-emerald-500/30 shadow-xl'
                        : isSelected
                        ? 'border-white bg-zinc-900 text-white scale-[1.03] shadow-xl'
                        : 'border-white/10 bg-zinc-900/40 text-white/70 hover:border-white/40 hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white">
                        #{bike.id}
                      </span>
                      <span className="text-xs font-mono font-black text-amber-400">
                        {bike.odds}
                      </span>
                    </div>

                    <h4
                      className="font-bold text-sm uppercase tracking-tight text-white truncate"
                      style={{ fontFamily: "'Anton', sans-serif" }}
                    >
                      {bike.name || bike.rider}
                    </h4>

                    <span className="text-[10px] font-mono text-white/50 mt-2 block truncate">
                      {bike.rider}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Simulation Track Stage */}
          {gameState === 'racing' && (
            <div className="mb-10 p-8 rounded-2xl bg-black border border-amber-500/40 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-amber-400 tracking-widest uppercase flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-spin" />
                  HIGH VELOCITY TELEMETRY ACTIVE
                </span>
                <span className="text-xs font-mono text-white/50">210 MPH AVERAGE</span>
              </div>
              <div className="h-4 w-full bg-zinc-900 rounded-full overflow-hidden relative">
                <div className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 animate-[pulse_1s_infinite] w-full origin-left"></div>
              </div>
            </div>
          )}

          {/* Result Banner */}
          {gameState === 'result' && (
            <div
              className={`mb-10 p-8 rounded-2xl border text-center transition-all ${
                playerWon
                  ? 'bg-emerald-950/60 border-emerald-400 shadow-2xl'
                  : 'bg-zinc-900 border-white/20'
              }`}
            >
              {playerWon ? (
                <div>
                  <Award className="w-12 h-12 text-emerald-400 mx-auto mb-2 animate-bounce" />
                  <h3
                    className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-2"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                  >
                    VICTORY! YOU SECURED {potentialPayout} ETH
                  </h3>
                  <p className="text-xs font-mono text-emerald-300 uppercase tracking-widest">
                    REWARDS STAMPED TO WALLET & $LAP REWARD POOL CREDITED
                  </p>
                </div>
              ) : (
                <div>
                  <h3
                    className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight mb-2"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                  >
                    RIG #{winningBikeId} TOOK THE PODIUM
                  </h3>
                  <p className="text-xs font-mono text-white/60 uppercase tracking-widest">
                    BETTER LUCK NEXT HEAT // ROUND #{currentRound + 1} STARTING SOON
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Wager Controls and Commit Action */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-8 border-t border-white/10">
            <div className="md:col-span-4">
              <span className="text-xs font-mono text-white/50 block mb-2 uppercase tracking-widest">
                2. STAKE AMOUNT (ETH)
              </span>
              <div className="flex items-center gap-2">
                {['0.01', '0.05', '0.10', '0.25'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setWager(val)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase border transition-colors ${
                      wager === val
                        ? 'bg-white text-black border-white'
                        : 'bg-zinc-900 text-white/70 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-4">
              <span className="text-xs font-mono text-white/50 block mb-1 uppercase tracking-widest">
                ESTIMATED RETURN
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-black text-emerald-400">
                  {potentialPayout} ETH
                </span>
                <span className="text-xs font-mono text-white/50">
                  ({selectedBike.odds} multiplier)
                </span>
              </div>
            </div>

            <div className="md:col-span-4 flex justify-end">
              <button
                type="button"
                onClick={handleManualEnter}
                disabled={gameState !== 'betting'}
                className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase text-base tracking-wider hover:bg-zinc-100 hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-3"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                <Play className="w-5 h-5 fill-current" />
                <span>ENTER HEAT NOW</span>
              </button>
            </div>
          </div>
        </div>

        {/* Past Results Ledger Strip */}
        <div ref={pastResultsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pastResults.map((res, i) => (
            <div
              key={i}
              className="velocity-skew p-6 rounded-2xl bg-zinc-950 border border-white/10 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-white/40 uppercase">ROUND #{res.round}</span>
                <span className="text-xs font-mono font-bold text-emerald-400">{res.prize}</span>
              </div>
              <span
                className="font-bold text-white uppercase text-base tracking-tight mb-2"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                {res.winner}
              </span>
              <span className="text-[11px] font-mono text-white/60">
                Pool Disbursed: {res.pool}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
