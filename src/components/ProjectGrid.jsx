import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, memo, useCallback, useMemo } from 'react';

const projects = [
  {
    id: 1,
    title: 'NEON GENESIS',
    category: '3D Visualization',
    image: '/projects/neon-genesis.jpg',
    color: 'from-purple-600/40 to-blue-600/40',
    scrollSpeed: 0.8,
    overlap: 0,
    column: 0,
  },
  {
    id: 2,
    title: 'FLUX UI',
    category: 'UX/UI Design',
    image: '/projects/flux-ui.jpg',
    color: 'from-cyan-600/40 to-teal-600/40',
    scrollSpeed: 1.2,
    overlap: 0,
    column: 1,
  },
  {
    id: 3,
    title: 'MATERIAL STUDY',
    category: '3D Texturing',
    image: '/projects/material-study.jpg',
    color: 'from-orange-600/40 to-red-600/40',
    scrollSpeed: 0.6,
    overlap: 0,
    column: 2,
  },
  {
    id: 4,
    title: 'BRAND IDENTITY',
    category: 'Graphic Design',
    image: '/projects/brand-identity.jpg',
    color: 'from-pink-600/40 to-rose-600/40',
    scrollSpeed: 1.0,
    overlap: 0,
    column: 0,
  },
  {
    id: 5,
    title: 'PRODUCT RENDER',
    category: '3D Visualization',
    image: '/projects/product-render.jpg',
    color: 'from-emerald-600/40 to-green-600/40',
    scrollSpeed: 0.7,
    overlap: 0,
    column: 1,
  },
  {
    id: 6,
    title: 'APP REDESIGN',
    category: 'UX Research',
    image: '/projects/app-redesign.jpg',
    color: 'from-indigo-600/40 to-violet-600/40',
    scrollSpeed: 1.3,
    overlap: 0,
    column: 2,
  },
];

const ParallaxCard = memo(function ParallaxCard({ project, index }) {
  const ref = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Each card has unique scroll speed - reduced for smoother feel
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [50 * project.scrollSpeed, -50 * project.scrollSpeed]
  );

  // Aspect ratios vary by column
  const aspects = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/5]'];
  const aspect = aspects[project.column];

  // Memoized callbacks for image handlers
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);
  const handleImageError = useCallback(() => setImageError(true), []);

  return (
    <motion.article
      ref={ref}
      style={{ y, marginTop: project.overlap, willChange: 'transform' }}
      className="relative z-10 will-change-transform"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      data-cursor="project"
    >
      <div
        className={`group relative ${aspect} w-full overflow-hidden rounded-3xl bg-black border border-white/5
                   transition-colors duration-700 ease-out
                   hover:border-white/20`}
      >
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${project.color}`}>
          {/* Placeholder letter */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10rem] md:text-[15rem] font-black text-white/[0.03] select-none leading-none">
              {project.title.charAt(0)}
            </span>
          </div>

          {/* Image */}
          {project.image && !imageError && (
            <img
              src={project.image}
              alt={project.title}
              className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 will-change-transform
                         group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              decoding="async"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

          {/* Noise texture */}
          <div className="absolute inset-0 opacity-30 mix-blend-overlay" 
               style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter leading-none">
            {project.title}
          </h3>
        </div>
      </div>
    </motion.article>
  );
});

// Memoized column offsets
const columnOffsets = [0, 120, 60];

export default function ProjectGrid() {
  const containerRef = useRef(null);

  // Memoize columns computation
  const columns = useMemo(() => {
    const cols = [[], [], []];
    projects.forEach((project) => {
      cols[project.column].push(project);
    });
    return cols;
  }, []);

  return (
    <section id="work" ref={containerRef} className="relative w-full py-32 bg-black overflow-hidden">
      {/* Section Title - Brutalist bleeding */}
      <div className="relative mb-24">
        <motion.h2
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-[20vw] font-black leading-none tracking-tighter text-white/[0.03] whitespace-nowrap select-none will-change-transform"
          style={{ marginLeft: '-5vw' }}
        >
        PROJECTS
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView8888={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute bottom-0 left-0 px-4 md:px-10"
        >
        </motion.div>
      </div>

      {/* Liquid Masonry Grid */}
      <div className="w-full px-2 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {columns.map((column, colIndex) => (
            <div
              key={colIndex}
              className="flex flex-col gap-3 md:gap-4"
              style={{ marginTop: columnOffsets[colIndex] }}
            >
              {column.map((project, i) => (
                <ParallaxCard
                  key={project.id}
                  project={project}
                  index={colIndex * 3 + i}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Expand Projects */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-24 flex justify-center"
      >
        <button className="group flex h-16 w-16 items-center justify-center rounded-full border border-white/20 transition-all duration-300 hover:border-white/40 hover:scale-110">
          <svg
            className="h-6 w-6 text-white/50 transition-all duration-300 group-hover:text-white group-hover:rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </motion.div>
    </section>
  );
}
