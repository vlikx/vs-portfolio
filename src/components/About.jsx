import { motion } from 'framer-motion';

const infoData = [
  { label: 'FOCUS', value: 'STUDY // UX' },
  { label: 'TIMELINE', value: '2018 — PRESENT' },
  { label: 'LOCATION', value: 'DE // REMOTE' },
  { label: 'MINDSET', value: 'VISION + VALUE' },
];

const skills = {
  advanced: [
    { name: 'Adobe Creative Suite', description: 'Photoshop, Illustrator, InDesign, After Effects' },
    { name: 'Substance 3D', description: 'Texturing & Material Design' },
    { name: 'Autodesk Maya', description: '3D Modeling & Animation' },
  ],
  intermediate: [
    { name: 'Unreal Engine', description: 'Real-time 3D & Visualization' },
    { name: 'Figma', description: 'UI/UX Design & Prototyping' },
    { name: 'Photography', description: 'Product & Lifestyle' },
  ],
};

// Flicker animation variants
const flickerIn = {
  hidden: { opacity: 0, filter: 'blur(4px)' },
  visible: (i) => ({
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.15,
      duration: 0.1,
      repeat: 2,
      repeatType: 'reverse',
    },
  }),
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  return (
    <section id="about" className="relative px-6 py-32 md:px-12 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">
            // STATUS
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-2xl font-bold uppercase tracking-tight text-white md:text-4xl"
        >
          VIKTOR STANG
        </motion.h2>

        {/* Info Grid - Technical Readout */}
        <div className="mb-24 grid grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
          {infoData.map((item, i) => (
            <motion.div
              key={item.label}
              custom={i}
              variants={flickerIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-black p-6"
            >
              <span className="block text-[10px] uppercase tracking-[0.3em] text-white/30">
                {item.label}
              </span>
              <span className="mt-2 block font-mono text-sm text-white md:text-base">
                {item.value}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar - Integrated with Info Grid */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24 flex items-center justify-between border-t border-b border-white/10 py-8"
        >
          <div>
            <span className="text-4xl font-bold text-white md:text-5xl">7+</span>
            <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/40">Years Active</p>
          </div>
          <div className="text-center">
            <span className="text-4xl font-bold text-white md:text-5xl">3</span>
            <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/40">Disciplines</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-bold text-accent md:text-5xl">∞</span>
            <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/40">Possibilities</p>
          </div>
        </motion.div>

        {/* Skills - Two Column Grid */}
        <div className="grid gap-12 md:grid-cols-2">
          {/* Advanced Skills */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-black">
                A
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                Advanced
              </span>
            </div>

            <div className="space-y-0">
              {skills.advanced.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="group border-b border-white/5 py-4 transition-colors hover:border-white/20"
                >
                  <h3 className="font-mono text-sm uppercase tracking-wider text-white transition-colors group-hover:text-accent">
                    {skill.name}
                  </h3>
                  <p className="mt-1 text-xs text-white/30">{skill.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Intermediate Skills */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-xs font-bold text-white/40">
                I
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                Intermediate
              </span>
            </div>

            <div className="space-y-0">
              {skills.intermediate.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
                  className="group border-b border-white/5 py-4 transition-colors hover:border-white/20"
                >
                  <h3 className="font-mono text-sm uppercase tracking-wider text-white transition-colors group-hover:text-accent">
                    {skill.name}
                  </h3>
                  <p className="mt-1 text-xs text-white/30">{skill.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
