import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useEffect, useRef } from 'react';

export default function ProjectModal({ project, isOpen, onClose }) {
  // Early return if project is null to prevent errors and black screen
  if (!project) return null;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef();
  const [randomOrder, setRandomOrder] = useState([]);

  // Early return if project is null to prevent errors



  // Reset state when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setImageLoaded(false);
    setIsPaused(false);
  }, [project]);

  // Autoplay effect (disabled for Wedding Flyer)
  const isWeddingFlyer = project && project.title && project.title.trim().toLowerCase().includes('wedding flyer');
  useEffect(() => {
    if (isWeddingFlyer) return;
    if (!isOpen || !project?.images?.length || project.images.length < 2 || isPaused) return;
    // Start first transition sooner
    let timeout = setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
      autoplayRef.current = setInterval(() => {
        setImageLoaded(false); // <-- trigger fade out before switching
        setTimeout(() => {
          setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
        }, 100); // fade out for 100ms before switching
      }, 2000);
    }, 1000); // 1 second for first image
    return () => {
      clearTimeout(timeout);
      clearInterval(autoplayRef.current);
    };
  }, [isOpen, project, isPaused, isWeddingFlyer]);

  // Handle escape key and lock scroll
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      if (window.lenis) {
        window.lenis.stop();
      }
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      if (window.lenis) {
      function getRandomOrder(length) {
        const arr = Array.from({ length }, (_, i) => i);
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      }
        window.lenis.start();
      }
    };
  }, [isOpen, onClose]);


  const handleNext = useCallback(() => {
    if (project?.images?.length > 1) {
      setImageLoaded(false);
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
      setIsPaused(true); // manual override pauses autoplay
    }
  }, [project]);

  const handlePrev = useCallback(() => {
    if (project?.images?.length > 1) {
      setImageLoaded(false);
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
      setIsPaused(true); // manual override pauses autoplay
    }
  }, [project]);

  const handleImageLoad = useCallback(() => setImageLoaded(true), []);


  // For Wedding Flyer, always show the GIF as the only image, no autoplay
  let hasMultipleImages = project.images?.length > 1;
  let currentImage = project.images?.[currentImageIndex] || project.image;
  if (isWeddingFlyer) {
    // Use Vite static import for GIF
    const gifModules = import.meta.glob('/src/assets/projects/Wedding Flyer/01_compressed.gif', { eager: true, import: 'default' });
    currentImage = gifModules['/src/assets/projects/Wedding Flyer/01_compressed.gif'];
    hasMultipleImages = false;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain"
          onClick={onClose}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/98" />

          {/* Noise Texture */}
          <div 
            className="pointer-events-none fixed inset-0 opacity-20 mix-blend-overlay"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
          />

          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onClose}
            className="fixed top-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/60 transition-all hover:border-white/40 hover:text-white hover:scale-110"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>

          {/* Full Page Content */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 min-h-screen"
          >
            {/* Hero Image Section */}
            <div
              className="relative h-[75vh] w-full overflow-hidden"
            >

              {/* Current Image (z-10) */}
              <motion.img
                key={currentImageIndex}
                src={currentImage}
                alt={project.title}
                animate={{ opacity: imageLoaded ? 1 : 0, scale: 1 }}
                initial={{ opacity: 0, scale: 1.05 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                onLoad={handleImageLoad}
                className="h-[60vh] w-full object-contain mt-10 relative z-10"
                style={{ boxShadow: 'none' }}
              />

              {/* Background Gradient (z-0) */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-40 z-0`} />

              {/* Loading indicator */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <svg className="animate-spin h-12 w-12 text-accent" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-20" cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="6" />
                    <path d="M44 24c0-11.046-8.954-20-20-20" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="opacity-80" />
                  </svg>
                </div>
              )}

              {/* Gradient Overlay Bottom */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />

              {/* Navigation Arrows and Image Counter removed for cleaner look */}
            </div>



            {/* Content Section */}
            <div className="relative bg-black px-6 pt-12 pb-16 md:px-16 lg:px-24">
              <div className="mx-auto max-w-5xl">
                {/* Header Row */}
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  {/* Title & Category */}
                  <div className="flex-1">
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-[10px] uppercase tracking-[0.4em] text-accent"
                    >
                      {project.category}
                    </motion.span>

                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="mt-4 text-3xl font-black uppercase tracking-tighter text-white md:text-5xl lg:text-6xl"
                      style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}
                    >
                      {project.title}
                    </motion.h1>
                  </div>

                  {/* Meta Info */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-4 md:pt-8"
                  >
                    <span className="font-mono text-xs text-white/30">
                      PROJECT #{String(project.id).padStart(2, '0')}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  </motion.div>
                </div>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.45, duration: 0.8 }}
                  className="my-12 h-px w-full origin-left bg-white/10"
                />

                {/* Details Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
                    // Details
                  </span>

                  <div className="mt-8">
                    {project.description ? (
                      (() => {
                        const lines = project.description.split('\n').filter(line => line.trim());
                        const sections = [];
                        let currentSection = null;
                        let headerInfo = null;
                        let dateInfo = null;

                        lines.forEach((line, idx) => {
                          const trimmed = line.trim();
                          const isBullet = trimmed.startsWith('-') || trimmed.startsWith('•');
                          const content = isBullet ? trimmed.slice(1).trim() : trimmed;
                          const colonIndex = content.indexOf(':');
                          const hasBulletWithColon = isBullet && colonIndex > 0 && colonIndex < 50;
                          
                          // Check if it's a date line (contains year patterns like 2021, 2023)
                          const isDate = /\d{4}/.test(trimmed) && (trimmed.includes('–') || trimmed.includes('-') || trimmed.toLowerCase().includes('present'));
                          
                          // First line without bullet = header/role
                          if (idx === 0 && !isBullet) {
                            headerInfo = trimmed;
                          }
                          // Date info
                          else if (isDate && !isBullet) {
                            dateInfo = trimmed;
                          }
                          // Section header (non-bullet, no colon, not first line, not date)
                          else if (!isBullet && colonIndex === -1 && !isDate) {
                            currentSection = { title: trimmed, items: [] };
                            sections.push(currentSection);
                          }
                          // Bullet with colon = detail item
                          else if (hasBulletWithColon) {
                            if (!currentSection) {
                              currentSection = { title: null, items: [] };
                              sections.push(currentSection);
                            }
                            currentSection.items.push({
                              title: content.slice(0, colonIndex),
                              description: content.slice(colonIndex + 1).trim()
                            });
                          }
                          // Plain text line
                          else if (!isBullet && content) {
                            if (!currentSection) {
                              currentSection = { title: null, items: [] };
                              sections.push(currentSection);
                            }
                            currentSection.items.push({ description: content });
                          }
                        });

                        return (
                          <>
                            {/* Header & Date Row */}
                            {(headerInfo || dateInfo) && (
                              <div className="mb-10 flex flex-wrap items-center gap-4 border-b border-white/10 pb-6">
                                {headerInfo && (
                                  <span className="text-lg font-bold text-white">{headerInfo}</span>
                                )}
                                {dateInfo && (
                                  <span className="rounded-full border border-accent/30 bg-accent/10 px-4 py-1 font-mono text-xs text-accent">
                                    {dateInfo}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Sections */}
                            <div className="space-y-10">
                              {sections.map((section, sIdx) => (
                                <motion.div
                                  key={sIdx}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.55 + sIdx * 0.1 }}
                                >
                                  {section.title && (
                                    <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-accent">
                                      {section.title}
                                    </h3>
                                  )}
                                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {section.items.map((item, iIdx) => (
                                      <div
                                        key={iIdx}
                                        className="group border-b border-white/5 py-4 pr-6 transition-colors hover:border-white/20"
                                      >
                                        {item.title ? (
                                          <>
                                            <h4 className="font-mono text-sm uppercase tracking-wider text-white transition-colors group-hover:text-accent">
                                              {item.title}
                                            </h4>
                                            <p className="mt-2 text-sm leading-relaxed text-white/50">
                                              {item.description}
                                            </p>
                                          </>
                                        ) : (
                                          <p className="text-sm leading-relaxed text-white/60">{item.description}</p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </>
                        );
                      })()
                    ) : (
                      <p className="text-base text-white/40">No description available.</p>
                    )}
                  </div>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
