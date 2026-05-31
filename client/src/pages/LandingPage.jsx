import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaFileAlt, FaVideo, FaChartLine, FaArrowRight, FaCheckCircle, FaStar, FaPlay } from 'react-icons/fa';

const FeatureCard = ({ icon, title, desc, delay, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, delay }}
    whileHover={{ y: -10, scale: 1.02 }}
    className="relative group bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300"
  >
    <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity ${color}`}></div>
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg border border-white/20 ${color} text-white`}>
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-white mb-4 font-heading">{title}</h3>
    <p className="text-neutral-400 leading-relaxed">{desc}</p>
  </motion.div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-neutral-100 font-body overflow-hidden selection:bg-brand-accent selection:text-white">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-dark/20 blur-[120px] mix-blend-screen animate-pulsefast"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-secondary/20 blur-[120px] mix-blend-screen"></div>
      </div>

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-dark to-brand-secondary flex items-center justify-center text-white font-bold text-xl shadow-glow">
              AI
            </div>
            <span className="text-2xl font-heading font-extrabold text-white tracking-wide">Interview</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/auth')} className="hidden sm:block px-5 py-2 text-neutral-300 font-medium hover:text-white transition">
              Log in
            </button>
            <button onClick={() => navigate('/auth')} className="px-6 py-2.5 bg-white text-brand-dark rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Get Started
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-brand-accent font-semibold text-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-accent"></span>
              </span>
              v2.0 AI Model Now Live
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-6xl lg:text-8xl font-heading font-black leading-tight text-white drop-shadow-lg">
              Crush Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-brand-secondary to-brand-dark animate-gradient bg-300%">
                Interviews
              </span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl text-neutral-400 max-w-lg leading-relaxed">
              HireMentor AI — Your personal AI interview coach that helps you practice smarter and perform with confidence, Get real-time feedback, improve your answers, and land your dream job faster.

            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 pt-4">
              <button onClick={() => navigate('/auth')} className="px-8 py-4 bg-gradient-to-r from-brand-dark to-brand-secondary text-white rounded-full font-bold text-lg hover:shadow-glow transition-all flex items-center justify-center gap-3 group relative overflow-hidden">
                <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full skew-x-12 group-hover:animate-shimmer"></span>
                Start Practicing Free
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-white/5 text-white border border-white/20 rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3 backdrop-blur-sm">
                <FaPlay className="text-brand-accent" /> See how it works
              </button>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex items-center gap-6 pt-8 border-t border-white/10">
              <div className="flex -space-x-4">
                {[1,2,3,4,5].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i+15}`} alt="user" className="w-12 h-12 rounded-full border-2 border-[#0a0a0f] shadow-lg" />
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex text-brand-accent mb-1">
                  {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                </div>
                <p className="text-sm text-neutral-400"><strong className="text-white">10,000+</strong> candidates placed</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Interactive Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative lg:h-[700px] flex items-center justify-center perspective-1000"
          >
            <motion.div style={{ y }} className="relative w-full max-w-lg aspect-square transform-gpu preserve-3d group">
              {/* Outer Rings */}
              <div className="absolute inset-0 rounded-full border border-brand-dark/30 animate-[spin_40s_linear_infinite]"></div>
              <div className="absolute inset-8 rounded-full border border-brand-secondary/30 animate-[spin_50s_linear_infinite_reverse]"></div>
              
              {/* Floating UI Cards */}
              <motion.div 
                animate={{ y: [-15, 15, -15], rotateZ: [-2, 2, -2] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -left-10 bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shadow-2xl z-20 flex items-center gap-4 group-hover:-translate-x-4 transition-transform"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
                  <FaChartLine />
                </div>
                <div>
                  <p className="text-xs text-neutral-300 font-medium uppercase tracking-wider mb-1">Confidence Score</p>
                  <p className="font-bold text-3xl text-white">98<span className="text-xl text-neutral-400">%</span></p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [15, -15, 15], rotateZ: [2, -2, 2] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 -right-10 bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shadow-2xl z-20 group-hover:translate-x-4 transition-transform"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center text-white">
                    <FaRobot />
                  </div>
                  <p className="text-sm text-neutral-300 font-bold">AI Coach</p>
                </div>
                <p className="text-white text-sm leading-relaxed max-w-[180px]">
                  "Your explanation of System Design was clear and concise. Great job!"
                </p>
              </motion.div>

              {/* Center Orb */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="relative w-72 h-72 rounded-full bg-gradient-to-tr from-brand-dark via-brand-secondary to-brand-accent p-1 cursor-pointer hover:scale-105 transition-transform duration-500 shadow-[0_0_100px_rgba(99,102,241,0.4)]">
                  <div className="w-full h-full rounded-full bg-[#0a0a0f] flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/assets/abstract-shapes.svg')] bg-cover opacity-20 animate-[spin_60s_linear_infinite]"></div>
                    <FaVideo className="text-7xl text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] z-10" />
                    <h3 className="text-3xl font-heading font-bold text-white text-center z-10 drop-shadow-md">Live AI<br/>Session</h3>
                    
                    {/* Audio visualizer effect */}
                    <div className="flex items-end gap-1 mt-6 h-8 z-10">
                      {[...Array(9)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: ['20%', '100%', '20%'] }}
                          transition={{ duration: 0.8 + Math.random(), repeat: Infinity, ease: "easeInOut", delay: Math.random() }}
                          className="w-1.5 bg-brand-accent rounded-full"
                        ></motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-brand-accent font-bold tracking-[0.2em] uppercase text-sm mb-4">Elite Toolset</h2>
            <h3 className="text-5xl lg:text-6xl font-heading font-black text-white">Unfair Advantage <br/> <span className="text-neutral-500">for your career.</span></h3>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FaRobot />}
              title="Hyper-Real Mock Interviews"
              desc="Engage with an AI that mimics actual recruiters. It adapts questions based on your resume and real-time responses."
              delay={0}
              color="bg-brand-dark"
            />
            <FeatureCard 
              icon={<FaFileAlt />}
              title="Smart ATS Resumes"
              desc="Generate pixel-perfect, ATS-beating resumes in seconds. Our AI highlights exactly what hiring managers want to see."
              delay={0.2}
              color="bg-brand-secondary"
            />
            <FeatureCard 
              icon={<FaChartLine />}
              title="Micro-Expression Analysis"
              desc="Get detailed metrics on your eye contact, speech pace, technical accuracy, and filler word usage instantly."
              delay={0.4}
              color="bg-emerald-500"
            />
          </div>
        </div>
      </section>

      {/* How it Works / Workflow */}
      <section className="py-32 relative z-10 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <motion.h2 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-5xl font-heading font-black text-white mb-12"
              >
                Seamless <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-brand-accent">Progression</span>
              </motion.h2>
              
              <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent hidden md:block"></div>
              
              <div className="space-y-12 relative">
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-white/10 hidden sm:block"></div>
                {[
                  { step: '01', title: 'Upload Your Context', desc: 'Feed the AI your resume and target job description to set the stage.' },
                  { step: '02', title: 'Face the AI Interviewer', desc: 'Experience a live, adaptive video interview with dynamic technical questions.' },
                  { step: '03', title: 'Iterate & Dominate', desc: 'Review your scorecards, fix your weak points, and step into the real interview with 100% confidence.' }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: idx * 0.2, duration: 0.6 }}
                    className="flex gap-8 relative z-10"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#0a0a0f] border-2 border-brand-accent flex items-center justify-center text-brand-accent font-bold shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                      {item.step}
                    </div>
                    <div className="pt-2">
                      <h4 className="text-2xl font-bold text-white mb-3">{item.title}</h4>
                      <p className="text-neutral-400 text-lg leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-[#12121a] rounded-3xl p-8 border border-white/10 shadow-2xl relative"
            >
              <div className="absolute -top-6 -right-6 bg-brand-dark text-white p-4 rounded-2xl shadow-glow font-bold flex items-center gap-3 animate-bounce">
                <FaCheckCircle className="text-2xl" /> Goal Reached!
              </div>
              <div className="space-y-8 pt-4">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                  <p className="text-sm text-neutral-400 flex justify-between mb-3"><span className="font-semibold text-white">Technical Accuracy</span> <span className="text-emerald-400 font-bold">92%</span></p>
                  <div className="h-4 w-full bg-[#0a0a0f] rounded-full overflow-hidden inset-shadow">
                    <motion.div initial={{width:0}} whileInView={{width:'92%'}} transition={{duration:1.5, ease: "easeOut"}} className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 relative">
                      <div className="absolute inset-0 bg-[url('/assets/stripes.png')] opacity-20 animate-[slide_1s_linear_infinite]"></div>
                    </motion.div>
                  </div>
                </div>
                
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                  <p className="text-sm text-neutral-400 flex justify-between mb-3"><span className="font-semibold text-white">Communication</span> <span className="text-brand-secondary font-bold">88%</span></p>
                  <div className="h-4 w-full bg-[#0a0a0f] rounded-full overflow-hidden inset-shadow">
                    <motion.div initial={{width:0}} whileInView={{width:'88%'}} transition={{duration:1.5, delay:0.3, ease: "easeOut"}} className="h-full bg-gradient-to-r from-brand-secondary to-pink-400"></motion.div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-brand-dark/20 border border-brand-dark/30 rounded-2xl relative overflow-hidden backdrop-blur-md">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-accent"></div>
                  <h5 className="text-white font-bold mb-2 flex items-center gap-2"><FaRobot className="text-brand-accent"/> AI Insight</h5>
                  <p className="text-neutral-300 italic text-lg leading-relaxed">"You perfectly explained the CAP theorem. Try to maintain more consistent eye contact with the camera to project ultimate confidence."</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-dark/10 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-6 text-center relative z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-brand-dark/90 via-brand/80 to-[#0a0a0f] rounded-[3rem] p-12 lg:p-24 shadow-glow border border-white/10 relative overflow-hidden group backdrop-blur-xl"
          >
            {/* Animated glowing orbs in background */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-brand-accent rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-brand-secondary rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
            
            <div className="relative z-10">
              <h2 className="text-5xl lg:text-7xl font-heading font-black mb-8 text-white drop-shadow-md">
                Stop Guessing.<br/>Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-yellow-300">Winning.</span>
              </h2>
              <p className="text-2xl text-neutral-300 mb-12 max-w-2xl mx-auto font-medium">
                The most advanced AI interview prep platform ever built. Your dream job is one click away.
              </p>
              <button 
                onClick={() => navigate('/auth')}
                className="px-12 py-6 bg-white text-brand-dark rounded-full font-black text-2xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.4)] flex items-center justify-center gap-4 mx-auto group"
              >
                Launch App
                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0a0a0f] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold text-sm">
                AI
              </div>
              <span className="text-xl font-heading font-bold text-white">Interview</span>
          </div>
          <p className="text-neutral-500 text-sm">© {new Date().getFullYear()} HireMentor AI. All rights reserved.</p>
          <div className="flex gap-6 text-neutral-400">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
