import { Category, Product, ProductImage, LoginAttempt } from './schema';

// Initial seed categories
const initialCategories: Category[] = [
  {
    id: '11111111-1111-4111-a111-111111111111',
    name: 'UI & Templates',
    slug: 'ui-templates',
    createdAt: new Date(),
  },
  {
    id: '22222222-2222-4222-a222-222222222222',
    name: 'Audio & DSP',
    slug: 'audio-dsp',
    createdAt: new Date(),
  },
  {
    id: '33333333-3333-4333-a333-333333333333',
    name: '3D & VFX',
    slug: '3d-vfx',
    createdAt: new Date(),
  },
  {
    id: '44444444-4444-4444-a444-444444444444',
    name: 'Software & Tools',
    slug: 'software-tools',
    createdAt: new Date(),
  },
  {
    id: '55555555-5555-4555-a555-555555555555',
    name: 'Fonts & Typography',
    slug: 'fonts-typography',
    createdAt: new Date(),
  },
];

// Initial seed products
const initialProducts: Product[] = [
  {
    id: 'a1b2c3d4-0001-4000-8000-000000000001',
    title: 'CyberMatrix HUD Interface Kit',
    slug: 'cybermatrix-hud-interface-kit',
    categoryId: '11111111-1111-4111-a111-111111111111',
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
    status: 'published',
    downloadCount: 342,
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
  },
  {
    id: 'a1b2c3d4-0002-4000-8000-000000000002',
    title: 'NeuralSynth Audio DSP Plugin Suite',
    slug: 'neuralsynth-audio-dsp-plugin-suite',
    categoryId: '22222222-2222-4222-a222-222222222222',
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
    status: 'published',
    downloadCount: 890,
    createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000),
  },
  {
    id: 'a1b2c3d4-0003-4000-8000-000000000003',
    title: 'Quantum Mesh 3D Cyber Shaders',
    slug: 'quantum-mesh-3d-cyber-shaders',
    categoryId: '33333333-3333-4333-a333-333333333333',
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
    status: 'published',
    downloadCount: 1240,
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
  },
  {
    id: 'a1b2c3d4-0004-4000-8000-000000000004',
    title: 'AeroZero High-Speed Protocol Engine',
    slug: 'aerozero-high-speed-protocol-engine',
    categoryId: '44444444-4444-4444-a444-444444444444',
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
    status: 'published',
    downloadCount: 512,
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
  },
  {
    id: 'a1b2c3d4-0005-4000-8000-000000000005',
    title: 'Apex Terminal Pro Font Family',
    slug: 'apex-terminal-pro-font-family',
    categoryId: '55555555-5555-4555-a555-555555555555',
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
    status: 'published',
    downloadCount: 2150,
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
  },
  {
    id: 'a1b2c3d4-0006-4000-8000-000000000006',
    title: 'CyberBlade Mech Animation Rig',
    slug: 'cyberblade-mech-animation-rig',
    categoryId: '33333333-3333-4333-a333-333333333333',
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
    status: 'published',
    downloadCount: 670,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const initialImages: ProductImage[] = [
  {
    id: 'img-1',
    productId: 'a1b2c3d4-0001-4000-8000-000000000001',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 0,
    createdAt: new Date(),
  },
  {
    id: 'img-2',
    productId: 'a1b2c3d4-0001-4000-8000-000000000001',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 1,
    createdAt: new Date(),
  },
  {
    id: 'img-3',
    productId: 'a1b2c3d4-0001-4000-8000-000000000001',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 2,
    createdAt: new Date(),
  },
  {
    id: 'img-4',
    productId: 'a1b2c3d4-0002-4000-8000-000000000002',
    url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 0,
    createdAt: new Date(),
  },
  {
    id: 'img-5',
    productId: 'a1b2c3d4-0002-4000-8000-000000000002',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 1,
    createdAt: new Date(),
  },
  {
    id: 'img-6',
    productId: 'a1b2c3d4-0003-4000-8000-000000000003',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 0,
    createdAt: new Date(),
  },
  {
    id: 'img-7',
    productId: 'a1b2c3d4-0003-4000-8000-000000000003',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 1,
    createdAt: new Date(),
  },
  {
    id: 'img-8',
    productId: 'a1b2c3d4-0004-4000-8000-000000000004',
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 0,
    createdAt: new Date(),
  },
  {
    id: 'img-9',
    productId: 'a1b2c3d4-0004-4000-8000-000000000004',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 1,
    createdAt: new Date(),
  },
  {
    id: 'img-10',
    productId: 'a1b2c3d4-0005-4000-8000-000000000005',
    url: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 0,
    createdAt: new Date(),
  },
  {
    id: 'img-11',
    productId: 'a1b2c3d4-0006-4000-8000-000000000006',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 0,
    createdAt: new Date(),
  },
  {
    id: 'img-12',
    productId: 'a1b2c3d4-0006-4000-8000-000000000006',
    url: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=80',
    sortOrder: 1,
    createdAt: new Date(),
  },
];

function getTableNameHelper(table: any): string {
  if (!table) return '';
  if (typeof table === 'string') return table;
  return (
    table?.[Symbol.for('drizzle:Name')] ||
    table?.[Symbol.for('drizzle:OriginalName')] ||
    table?._?.name ||
    table?._?.originalName ||
    (table as any)?.name ||
    ''
  );
}

// In-Memory store for development and local testing
export class MemoryDatabase {
  private categories: Category[] = [...initialCategories];
  private products: Product[] = [...initialProducts];
  private productImages: ProductImage[] = [...initialImages];
  private loginAttempts: LoginAttempt[] = [];

  select(fields?: any) {
    const self = this;
    return {
      from(table: any) {
        const tableName = getTableNameHelper(table);
        let dataset: any[] = [];
        if (tableName === 'categories') dataset = [...self.categories];
        else if (tableName === 'products') dataset = [...self.products];
        else if (tableName === 'product_images') dataset = [...self.productImages];
        else if (tableName === 'login_attempts') dataset = [...self.loginAttempts];

        let joined = false;
        let whereFilter: ((item: any) => boolean) | null = null;
        let limitCount: number | null = null;

        const queryObj = {
          leftJoin(joinTable: any, condition: any) {
            joined = true;
            return queryObj;
          },
          where(condition: any) {
            whereFilter = self.buildFilter(condition);
            return queryObj;
          },
          orderBy(sortCondition: any) {
            return queryObj;
          },
          limit(count: number) {
            limitCount = count;
            return queryObj;
          },
          then(resolve: any, reject?: any) {
            try {
              let res = dataset;
              if (joined) {
                res = self.products.map((p) => {
                  const cat = self.categories.find((c) => c.id === p.categoryId) || null;
                  return {
                    product: p,
                    category: cat,
                  };
                });
              }
              if (whereFilter) {
                res = res.filter(whereFilter);
              }
              if (limitCount !== null) {
                res = res.slice(0, limitCount);
              }
              resolve(res);
            } catch (err) {
              if (reject) reject(err);
              else throw err;
            }
          },
        };

        return queryObj;
      },
    };
  }

  insert(table: any) {
    const self = this;
    const tableName = getTableNameHelper(table);
    return {
      values(data: any) {
        return {
          returning() {
            const items = Array.isArray(data) ? data : [data];
            const createdItems: any[] = [];

            for (const item of items) {
              const id = item.id || crypto.randomUUID();
              const now = new Date();
              const created = {
                ...item,
                id,
                attemptedAt: now,
                createdAt: item.createdAt || now,
                updatedAt: item.updatedAt || now,
              };

              if (tableName === 'categories') {
                self.categories.push(created);
              } else if (tableName === 'products') {
                self.products.unshift(created);
              } else if (tableName === 'product_images') {
                self.productImages.push(created);
              } else if (tableName === 'login_attempts') {
                self.loginAttempts.unshift(created);
              }
              createdItems.push(created);
            }
            return Promise.resolve(createdItems);
          },
          then(resolve: any) {
            const items = Array.isArray(data) ? data : [data];
            for (const item of items) {
              const id = item.id || crypto.randomUUID();
              const now = new Date();
              const created = { ...item, id, attemptedAt: now, createdAt: now, updatedAt: now };
              if (tableName === 'login_attempts') self.loginAttempts.unshift(created);
              else if (tableName === 'product_images') self.productImages.push(created);
              else if (tableName === 'products') self.products.unshift(created);
              else if (tableName === 'categories') self.categories.push(created);
            }
            resolve();
          },
        };
      },
    };
  }

  update(table: any) {
    const self = this;
    const tableName = getTableNameHelper(table);
    return {
      set(updates: any) {
        return {
          where(condition: any) {
            return {
              returning(fields?: any) {
                const filter = self.buildFilter(condition);
                const updatedItems: any[] = [];

                if (tableName === 'products') {
                  for (let i = 0; i < self.products.length; i++) {
                    if (filter(self.products[i])) {
                      const current = self.products[i];
                      const newDownloadCount =
                        typeof updates.downloadCount === 'object'
                          ? current.downloadCount + 1
                          : updates.downloadCount !== undefined
                          ? updates.downloadCount
                          : current.downloadCount;

                      self.products[i] = {
                        ...current,
                        ...updates,
                        downloadCount: newDownloadCount,
                        updatedAt: new Date(),
                      };
                      updatedItems.push(self.products[i]);
                    }
                  }
                }
                return Promise.resolve(updatedItems);
              },
            };
          },
        };
      },
    };
  }

  delete(table: any) {
    const self = this;
    const tableName = getTableNameHelper(table);
    return {
      where(condition: any) {
        const filter = self.buildFilter(condition);
        if (tableName === 'products') {
          const removed = self.products.filter(filter);
          self.products = self.products.filter((p) => !filter(p));
          // Cascade delete images
          for (const p of removed) {
            self.productImages = self.productImages.filter((img) => img.productId !== p.id);
          }
        } else if (tableName === 'product_images') {
          self.productImages = self.productImages.filter((img) => !filter(img));
        }
        return Promise.resolve();
      },
    };
  }

  private buildFilter(condition: any): (item: any) => boolean {
    if (!condition) return () => true;

    // Check simple eq conditions
    const colName =
      condition.left?.name ||
      condition.column?.name ||
      (typeof condition.left === 'string' ? condition.left : '') ||
      '';
    const val =
      condition.right?.value !== undefined
        ? condition.right.value
        : condition.right !== undefined
        ? condition.right
        : condition.value;

    if (colName && val !== undefined) {
      return (item: any) => {
        const target = item?.product ? item.product : item;
        const itemVal = target[colName] || target[this.camelCase(colName)];
        return itemVal === val;
      };
    }

    // Check gte condition
    if (condition.operator === 'gte' || condition.operator === '>=') {
      const col = condition.left?.name || 'attemptedAt';
      const minDate = condition.right?.value || condition.right;
      return (item: any) => {
        const target = item?.product ? item.product : item;
        const d = target[col] || target[this.camelCase(col)];
        return d && minDate ? new Date(d).getTime() >= new Date(minDate).getTime() : true;
      };
    }

    // Check queryChunks (e.g. from Drizzle and() queries)
    if (condition?.queryChunks) {
      let targetIp: string | null = null;
      let targetStatus: string | null = null;
      let targetSuccess: boolean | null = null;
      let minDate: Date | null = null;
      let targetId: string | null = null;
      let targetSlug: string | null = null;

      for (const chunk of condition.queryChunks) {
        if (typeof chunk?.value === 'string') {
          if (chunk.value.includes('.') || chunk.value.includes(':') || chunk.value === '127.0.0.1') {
            targetIp = chunk.value;
          } else if (chunk.value === 'published' || chunk.value === 'draft') {
            targetStatus = chunk.value;
          } else if (chunk.value.length === 36 && chunk.value.includes('-')) {
            targetId = chunk.value;
          } else {
            targetSlug = chunk.value;
          }
        } else if (typeof chunk?.value === 'boolean') {
          targetSuccess = chunk.value;
        } else if (chunk?.value instanceof Date) {
          minDate = chunk.value;
        }
      }

      return (item: any) => {
        const target = item?.product ? item.product : item;
        if (targetStatus !== null && target.status !== undefined && target.status !== targetStatus) return false;
        if (targetIp !== null && target.ip !== undefined && target.ip !== targetIp) return false;
        if (targetSuccess !== null && target.success !== undefined && target.success !== targetSuccess) return false;
        if (minDate !== null && target.attemptedAt !== undefined && new Date(target.attemptedAt).getTime() < minDate.getTime()) return false;
        if (targetId !== null && target.id !== undefined && target.id !== targetId) return false;
        if (targetSlug !== null && target.slug !== undefined && target.slug !== targetSlug) return false;
        return true;
      };
    }

    return () => true;
  }

  private camelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, g) => g.toUpperCase());
  }
}

export const memoryDb = new MemoryDatabase();
