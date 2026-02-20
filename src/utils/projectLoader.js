/**
 * Auto-detects projects from src/assets/projects/
 * 
 * How to use:
 * 
 * OPTION 1: Folder per project (recommended for multiple images)
 *   src/assets/projects/
 *     my-project/
 *       cover.jpg (or any image - first alphabetically is used as cover)
 *       my-project.txt (description file)
 *       other-images.png
 * 
 * OPTION 2: Single image per project
 *   src/assets/projects/
 *     my-project.jpg
 *     my-project.txt (optional description)
 * 
 * Description file format:
 *   First line = Category (e.g., "3D Visualization")
 *   Rest = Description text
 */

// Import all project images (flat structure)
const flatImageModules = import.meta.glob(
  '/src/assets/projects/*.{jpg,jpeg,png,gif,webp,avif}',
  { eager: true, import: 'default' }
);

// Import all project images from folders
const folderImageModules = import.meta.glob(
  '/src/assets/projects/*/*.{jpg,jpeg,png,gif,webp,avif}',
  { eager: true, import: 'default' }
);

// Import all description files (flat)
const flatTextModules = import.meta.glob(
  '/src/assets/projects/*.txt',
  { eager: true, query: '?raw', import: 'default' }
);

// Import all description files (folders)
const folderTextModules = import.meta.glob(
  '/src/assets/projects/*/*.txt',
  { eager: true, query: '?raw', import: 'default' }
);

// Color gradients to cycle through
const colorGradients = [
  'from-purple-600/40 to-blue-600/40',
  'from-cyan-600/40 to-teal-600/40',
  'from-orange-600/40 to-red-600/40',
  'from-pink-600/40 to-rose-600/40',
  'from-emerald-600/40 to-green-600/40',
  'from-indigo-600/40 to-violet-600/40',
  'from-amber-600/40 to-yellow-600/40',
  'from-sky-600/40 to-blue-600/40',
];

// Scroll speeds for parallax variety
const scrollSpeeds = [0.8, 1.2, 0.6, 1.0, 0.7, 1.3, 0.9, 1.1];

/**
 * Convert filename to display title
 * "my-cool-project" → "MY COOL PROJECT"
 */
function filenameToTitle(filename) {
  return filename
    .replace(/oe/gi, 'ö')
    .replace(/[-_]/g, ' ')
    .toUpperCase();
}

/**
 * Extract filename without extension from path
 */
function getBasename(path) {
  const filename = path.split('/').pop();
  return filename.replace(/\.[^.]+$/, '');
}

/**
 * Parse description file content
 * First line = category, rest = description
 */
function parseDescriptionFile(content) {
  if (!content) return { category: 'Project', description: '' };
  
  const lines = content.trim().split('\n');
  const category = lines[0]?.trim() || 'Project';
  const description = lines.slice(1).join('\n').trim();
  
  return { category, description };
}

/**
 * Extract folder name from path
 */
function getFolderName(path) {
  const parts = path.split('/');
  // Path like /src/assets/projects/folder-name/image.jpg
  return parts[parts.length - 2];
}

/**
 * Load all projects from the assets/projects folder
 * Returns array of project objects ready for ProjectGrid
 */
export function loadProjects() {
  const projects = [];
  const processedFolders = new Set();
  let id = 1;

  // Process folder-based projects first
  for (const [imagePath, imageUrl] of Object.entries(folderImageModules)) {
    const folderName = getFolderName(imagePath);
    
    // Skip if we already processed this folder
    if (processedFolders.has(folderName)) continue;
    processedFolders.add(folderName);
    
    // Get all images in this folder
    const folderImages = Object.entries(folderImageModules)
      .filter(([path]) => getFolderName(path) === folderName)
      .sort(([a], [b]) => a.localeCompare(b));
    
    // Use first image as cover
    const [, coverImage] = folderImages[0];
    
    // Get all images for gallery
    const allImages = folderImages.map(([, url]) => url);
    
    // Find description file
    const textPath = `/src/assets/projects/${folderName}/${folderName}.txt`;
    const textContent = folderTextModules[textPath] || '';
    
    const { category, description } = parseDescriptionFile(textContent);
    
    // Distribute projects across 3 columns
    const column = (id - 1) % 3;
    
    projects.push({
      id,
      title: filenameToTitle(folderName),
      category,
      description,
      image: coverImage,
      images: allImages,
      color:
        folderName.toLowerCase() === 'no sense of time'
          ? 'from-yellow-300/70 to-pink-300/70'
          : colorGradients[(id - 1) % colorGradients.length],
      scrollSpeed: scrollSpeeds[(id - 1) % scrollSpeeds.length],
      overlap: 0,
      column,
    });
    
    id++;
  }

  // Process flat image projects
  for (const [imagePath, imageUrl] of Object.entries(flatImageModules)) {
    const basename = getBasename(imagePath);
    const textPath = `/src/assets/projects/${basename}.txt`;
    const textContent = flatTextModules[textPath] || '';
    
    const { category, description } = parseDescriptionFile(textContent);
    
    // Distribute projects across 3 columns
    const column = (id - 1) % 3;
    
    projects.push({
      id,
      title: filenameToTitle(basename),
      category,
      description,
      image: imageUrl,
      images: [imageUrl],
      color: colorGradients[(id - 1) % colorGradients.length],
      scrollSpeed: scrollSpeeds[(id - 1) % scrollSpeeds.length],
      overlap: 0,
      column,
    });
    
    id++;
  }

  return projects;
}

/**
 * Get projects organized by columns for masonry layout
 */
export function getProjectColumns(projects) {
  const columns = [[], [], []];
  projects.forEach((project) => {
    columns[project.column].push(project);
  });
  return columns;
}
