import * as dotenv from 'dotenv';
dotenv.config();

import { db } from '../src/db';
import { categories, products, productImages } from '../src/db/schema';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('\x1b[36m=== Seeding Craftora Store Database ===\x1b[0m');

  // 1. Seed Categories
  const categoryData = [
    { name: 'UI & Templates', slug: 'ui-templates' },
    { name: 'Audio & DSP', slug: 'audio-dsp' },
    { name: '3D & VFX', slug: '3d-vfx' },
    { name: 'Software & Tools', slug: 'software-tools' },
    { name: 'Fonts & Typography', slug: 'fonts-typography' },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categoryData) {
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, cat.slug))
      .limit(1);

    if (existing.length > 0) {
      categoryMap.set(cat.slug, existing[0].id);
      console.log(`Category exists: ${cat.name}`);
    } else {
      const inserted = await db.insert(categories).values(cat).returning();
      categoryMap.set(cat.slug, inserted[0].id);
      console.log(`Created category: ${cat.name}`);
    }
  }

  // 2. Seed 6 Products
  const seedProducts = [
    {
      title: 'CyberMatrix HUD Interface Kit',
      slug: 'cybermatrix-hud-interface-kit',
      categorySlug: 'ui-templates',
      tags: ['hud', 'cyberpunk', 'futuristic', 'ui', 'vectors'],
      version: '3.2.0',
      description:
        'High-resolution futuristic heads-up display (HUD) vector elements, circular gauges, target reticles, digital graphs, and telemetry widgets.\n\nLayered PSD, SVG, and Figma vectors included. Ready for sci-fi games, cinematic trailers, and dashboard interfaces.\n\n[DUMMY SEED DATA - CRAFTORA STORE]',
      fileName: 'cybermatrix_hud_v3.2.zip',
      fileSize: 145800000,
      fileType: 'application/zip',
      fileUrl:
        'https://craftora-store.public.blob.vercel-storage.com/dummy/cybermatrix_hud_v3.2.zip',
      coverImageUrl:
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
      ],
      downloadCount: 342,
      status: 'published' as const,
    },
    {
      title: 'NeuralSynth Audio DSP Plugin Suite',
      slug: 'neuralsynth-audio-dsp-plugin-suite',
      categorySlug: 'audio-dsp',
      tags: ['vst3', 'audio', 'synthesizer', 'neural', 'dsp'],
      version: '1.8.4',
      description:
        'Next-generation neural waveform synthesizer and spectral morphing engine.\n\nFeatures 64-voice polyphony, holographic filter matrices, real-time wave folding, and over 400 cyberpunk presets. Compatible with VST3, AU, and AAX 64-bit DAWs.\n\n[DUMMY SEED DATA - CRAFTORA STORE]',
      fileName: 'neuralsynth_dsp_bundle.zip',
      fileSize: 289400000,
      fileType: 'application/zip',
      fileUrl:
        'https://craftora-store.public.blob.vercel-storage.com/dummy/neuralsynth_dsp_bundle.zip',
      coverImageUrl:
        'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      ],
      downloadCount: 890,
      status: 'published' as const,
    },
    {
      title: 'Quantum Mesh 3D Cyber Shaders',
      slug: 'quantum-mesh-3d-cyber-shaders',
      categorySlug: '3d-vfx',
      tags: ['blender', 'unreal', 'shaders', 'materials', '3d'],
      version: '2.1.0',
      description:
        'Photorealistic volumetric neon glow, chromatic aberration, energy shield, and holographic wireframe shaders for Blender Cycles/EEVEE and Unreal Engine 5.\n\nPBR 8K textures and substance designer node graphs included.\n\n[DUMMY SEED DATA - CRAFTORA STORE]',
      fileName: 'quantum_mesh_shaders_8k.rar',
      fileSize: 412000000,
      fileType: 'application/x-rar-compressed',
      fileUrl:
        'https://craftora-store.public.blob.vercel-storage.com/dummy/quantum_mesh_shaders_8k.rar',
      coverImageUrl:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
      ],
      downloadCount: 1240,
      status: 'published' as const,
    },
    {
      title: 'AeroZero High-Speed Protocol Engine',
      slug: 'aerozero-high-speed-protocol-engine',
      categorySlug: 'software-tools',
      tags: ['networking', 'rust', 'low-latency', 'protocols', 'cli'],
      version: '4.0.1',
      description:
        'Zero-copy UDP/QUIC multiplexing gateway with hardware timestamping, kernel bypass drivers, and microsecond packet routing.\n\nNative binaries compiled for Linux x86_64, macOS ARM64, and Windows.\n\n[DUMMY SEED DATA - CRAFTORA STORE]',
      fileName: 'aerozero_protocol_suite.tar.gz',
      fileSize: 67200000,
      fileType: 'application/gzip',
      fileUrl:
        'https://craftora-store.public.blob.vercel-storage.com/dummy/aerozero_protocol_suite.tar.gz',
      coverImageUrl:
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      ],
      downloadCount: 512,
      status: 'published' as const,
    },
    {
      title: 'Apex Terminal Pro Font Family',
      slug: 'apex-terminal-pro-font-family',
      categorySlug: 'fonts-typography',
      tags: ['fonts', 'monospaced', 'coding', 'ligatures', 'typography'],
      version: '1.5.0',
      description:
        'Engineered monospaced typeface crafted specifically for high-density code editors, terminal displays, and HUD readouts.\n\n16 weights, programming ligatures, and complete powerline symbol coverage. TrueType and OpenType formats.\n\n[DUMMY SEED DATA - CRAFTORA STORE]',
      fileName: 'apex_terminal_fonts_otf_ttf.zip',
      fileSize: 24500000,
      fileType: 'application/zip',
      fileUrl:
        'https://craftora-store.public.blob.vercel-storage.com/dummy/apex_terminal_fonts_otf_ttf.zip',
      coverImageUrl:
        'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      ],
      downloadCount: 2150,
      status: 'published' as const,
    },
    {
      title: 'CyberBlade Mech Animation Rig',
      slug: 'cyberblade-mech-animation-rig',
      categorySlug: '3d-vfx',
      tags: ['animation', 'rig', 'mech', 'robotics', 'fbx'],
      version: '1.0.0',
      description:
        'Fully articulated robotic combat exoskeleton rigged in Maya, Blender, and FBX with 48 weapon transform animations, inverse kinematics, and customizable armor plates.\n\n[DUMMY SEED DATA - CRAFTORA STORE]',
      fileName: 'cyberblade_mech_rig.zip',
      fileSize: 320000000,
      fileType: 'application/zip',
      fileUrl:
        'https://craftora-store.public.blob.vercel-storage.com/dummy/cyberblade_mech_rig.zip',
      coverImageUrl:
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=80',
      ],
      downloadCount: 670,
      status: 'published' as const,
    },
  ];

  for (const item of seedProducts) {
    const existing = await db
      .select()
      .from(products)
      .where(eq(products.slug, item.slug))
      .limit(1);

    const categoryId = categoryMap.get(item.categorySlug) || null;

    if (existing.length > 0) {
      console.log(`Product already exists: ${item.title}`);
    } else {
      const inserted = await db
        .insert(products)
        .values({
          title: item.title,
          slug: item.slug,
          categoryId,
          tags: item.tags,
          version: item.version,
          description: item.description,
          fileName: item.fileName,
          fileSize: item.fileSize,
          fileType: item.fileType,
          fileUrl: item.fileUrl,
          coverImageUrl: item.coverImageUrl,
          downloadCount: item.downloadCount,
          status: item.status,
        })
        .returning();

      const newProduct = inserted[0];

      for (let i = 0; i < item.galleryImages.length; i++) {
        await db.insert(productImages).values({
          productId: newProduct.id,
          url: item.galleryImages[i],
          sortOrder: i,
        });
      }

      console.log(`Seeded product: ${item.title}`);
    }
  }

  console.log('\x1b[32m✔ Seed completed successfully!\x1b[0m');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
