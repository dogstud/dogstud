#!/usr/bin/env node
/**
 * seed-listings.js — Insert 15 demo stud listings into pending_stud_submissions
 *
 * Usage:
 *   node scripts/seed-listings.js           # Insert (skips if already seeded)
 *   node scripts/seed-listings.js --force   # Delete existing demo seeds, re-insert
 *   node scripts/seed-listings.js --cleanup # Delete all demo_seed rows and exit
 */

const https = require('https')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sxlewfgmkzhhawxugrrt.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const args = process.argv.slice(2)
const FORCE = args.includes('--force')
const CLEANUP = args.includes('--cleanup')

function makeSlug(dogName, breed, city, state) {
  return [dogName, breed, city, state]
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function supabaseRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null
    const options = {
      hostname: 'sxlewfgmkzhhawxugrrt.supabase.co',
      path: `/rest/v1/${path}`,
      method,
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': method === 'POST' ? 'return=representation' : 'return=minimal',
      },
    }
    if (bodyStr) {
      options.headers['Content-Length'] = Buffer.byteLength(bodyStr)
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(data ? JSON.parse(data) : null) }
          catch (e) { resolve(data) }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`))
        }
      })
    })
    req.on('error', reject)
    if (bodyStr) req.write(bodyStr)
    req.end()
  })
}

const DEMO_LISTINGS = [
  // French Bulldogs
  {
    dog_name: 'Atlas', breed: 'French Bulldog', color_traits: 'Blue merle, tan points, blue eyes',
    city: 'San Diego', state: 'California', stud_fee: 2000, age: 3,
    description: 'Atlas is a blue merle French Bulldog with tan points and blue eyes. Compact structure, short muzzle, good temperament with females. Located in San Diego. Contact for availability and stud terms.',
    akc_status: 'AKC Registered', health_testing: 'CAER clear, cardiac exam passed', chilled_semen_available: true,
  },
  {
    dog_name: 'King', breed: 'French Bulldog', color_traits: 'Lilac and tan, fluffy carrier',
    city: 'Los Angeles', state: 'California', stud_fee: 2500, age: 2,
    description: 'King is a lilac and tan French Bulldog proven sire based in Los Angeles. Carries fluffy gene. Strong bone structure, excellent topline. Available for natural service and chilled semen shipments.',
    akc_status: 'AKC Registered', health_testing: 'Cardiac clear, patella OFA normal', chilled_semen_available: true,
  },
  {
    dog_name: 'Ghost', breed: 'French Bulldog', color_traits: 'Platinum, cream base, fluffy',
    city: 'Miami', state: 'Florida', stud_fee: 3000, age: 4,
    description: 'Ghost is a platinum fluffy French Bulldog with a cream base coat. Proven producer of fluffy and platinum offspring. Located in Miami. Chilled and fresh-cooled semen available nationwide.',
    akc_status: 'AKC Registered', health_testing: 'CAER clear, OFA hips fair', chilled_semen_available: true,
  },
  {
    dog_name: 'Diesel', breed: 'French Bulldog', color_traits: 'Blue, compact, heavy bone',
    city: 'Houston', state: 'Texas', stud_fee: 1500, age: 3,
    description: 'Diesel is a blue French Bulldog with heavy bone and a wide chest. Bred for structure and temperament. Located in Houston, Texas. Available for local natural service.',
    akc_status: 'AKC Registerable', health_testing: null, chilled_semen_available: false,
  },
  {
    dog_name: 'Duke', breed: 'French Bulldog', color_traits: 'Chocolate merle, rope wrinkle',
    city: 'Phoenix', state: 'Arizona', stud_fee: 1800, age: 2,
    description: 'Duke is a chocolate merle French Bulldog based in Phoenix. Deep rope wrinkle, strong rear, confident temperament. Contact for availability.',
    akc_status: null, health_testing: null, chilled_semen_available: false,
  },
  {
    dog_name: 'Titan', breed: 'French Bulldog', color_traits: 'Black and tan, thick neck, strong drive',
    city: 'Dallas', state: 'Texas', stud_fee: 1200, age: 5,
    description: 'Titan is a black and tan French Bulldog with a thick neck and strong drive. Proven sire with multiple litters on the ground. Located in Dallas. Natural service only.',
    akc_status: 'AKC Registered', health_testing: 'Patella OFA normal', chilled_semen_available: false,
  },
  {
    dog_name: 'Storm', breed: 'French Bulldog', color_traits: 'Blue fawn, green eyes, fluffy carrier',
    city: 'Las Vegas', state: 'Nevada', stud_fee: 1800, age: 3,
    description: 'Storm is a blue fawn French Bulldog with green eyes and confirmed fluffy gene. Located in Las Vegas. Available for natural service and chilled semen. Contact for stud terms and scheduling.',
    akc_status: 'AKC Registerable', health_testing: null, chilled_semen_available: true,
  },
  // English Bulldogs
  {
    dog_name: 'Bruno', breed: 'English Bulldog', color_traits: 'Fawn and white, heavy wrinkle, rope nose',
    city: 'Atlanta', state: 'Georgia', stud_fee: 1500, age: 4,
    description: 'Bruno is a fawn and white English Bulldog with heavy wrinkle and a deep rope nose. Strong bone, wide front, calm disposition. Located in Atlanta. Available for natural and chilled service.',
    akc_status: 'AKC Registered', health_testing: 'Cardiac clear, patella OFA normal', chilled_semen_available: true,
  },
  {
    dog_name: 'Tank', breed: 'English Bulldog', color_traits: 'Red brindle, massive frame, tri-color potential',
    city: 'Charlotte', state: 'North Carolina', stud_fee: 1200, age: 3,
    description: 'Tank is a red brindle English Bulldog with a massive frame. Known for producing heavy-wrinkled offspring with wide fronts. Located in Charlotte. Natural service available locally.',
    akc_status: 'AKC Registered', health_testing: null, chilled_semen_available: false,
  },
  {
    dog_name: 'Rocky', breed: 'English Bulldog', color_traits: 'Lilac tri, rare color, compact build',
    city: 'Orlando', state: 'Florida', stud_fee: 2000, age: 2,
    description: 'Rocky is a lilac tri English Bulldog based in Orlando. Rare color combination with a compact, well-proportioned build. Available for chilled semen nationwide. Contact for health certificates and stud agreement.',
    akc_status: 'AKC Registered', health_testing: 'CAER clear', chilled_semen_available: true,
  },
  {
    dog_name: 'Chief', breed: 'English Bulldog', color_traits: 'White and brindle, wide muzzle, wrinkle-heavy',
    city: 'San Antonio', state: 'Texas', stud_fee: 1000, age: 5,
    description: 'Chief is a white and brindle English Bulldog with a wide muzzle and heavy wrinkle. Proven producer over multiple seasons. Located in San Antonio. Natural service preferred.',
    akc_status: 'AKC Registered', health_testing: 'Patella OFA normal, cardiac clear', chilled_semen_available: false,
  },
  {
    dog_name: 'Rex', breed: 'English Bulldog', color_traits: 'Blue and white, stocky structure',
    city: 'Denver', state: 'Colorado', stud_fee: 1500, age: 3,
    description: 'Rex is a blue and white English Bulldog based in Denver. Stocky structure, wide chest, good temperament for breeding. Available for natural service locally. Contact for details.',
    akc_status: null, health_testing: null, chilled_semen_available: false,
  },
  // American Bully / Cane Corso
  {
    dog_name: 'Zeus', breed: 'American Bully', color_traits: 'Tri color, XL class, heavy bone',
    city: 'Memphis', state: 'Tennessee', stud_fee: 1500, age: 3,
    description: 'Zeus is a tri-color XL American Bully with heavy bone structure and a wide blocky head. Multiple confirmed litters. Located in Memphis. Contact for stud contract and health documentation.',
    akc_status: 'ABKC', health_testing: 'Cardiac clear, patella OFA normal', chilled_semen_available: false,
  },
  {
    dog_name: 'Goliath', breed: 'American Bully', color_traits: 'Merle, XL, blue eyes, short coat',
    city: 'Nashville', state: 'Tennessee', stud_fee: 2000, age: 2,
    description: 'Goliath is a merle XL American Bully with blue eyes and a short dense coat. Based in Nashville. Available for natural service. Strong bone, wide muzzle, excellent disposition.',
    akc_status: 'ABKC', health_testing: null, chilled_semen_available: false,
  },
  {
    dog_name: 'Caesar', breed: 'Cane Corso', color_traits: 'Black, cropped ears, working drive',
    city: 'Philadelphia', state: 'Pennsylvania', stud_fee: 1200, age: 4,
    description: 'Caesar is a black Cane Corso with cropped ears and strong working drive. Health tested and proven sire. Located in Philadelphia. Available for natural service. Contact for pedigree and health documentation.',
    akc_status: 'AKC Registered', health_testing: 'Hips OFA good, cardiac clear, CAER clear', chilled_semen_available: false,
  },
]

async function countExistingSeeds() {
  const result = await supabaseRequest('GET', 'pending_stud_submissions?source=eq.demo_seed&select=id')
  return Array.isArray(result) ? result.length : 0
}

async function deleteExistingSeeds() {
  await supabaseRequest('DELETE', 'pending_stud_submissions?source=eq.demo_seed', null)
  console.log('Deleted existing demo seeds.')
}

async function insertListings() {
  const now = new Date().toISOString()
  const rows = DEMO_LISTINGS.map((l) => ({
    dog_name: l.dog_name,
    breed: l.breed,
    sex: 'male',
    age: l.age,
    color_traits: l.color_traits,
    city: l.city,
    state: l.state,
    stud_fee: l.stud_fee,
    owner_name: 'DogStud Demo',
    phone_number: '(000) 000-0000',
    email: 'demo@dogstud.com',
    description: l.description,
    akc_status: l.akc_status || null,
    health_testing: l.health_testing || null,
    chilled_semen_available: l.chilled_semen_available,
    photos: [],
    status: 'approved',
    featured: false,
    verified: false,
    source: 'demo_seed',
    ownership_confirmed: true,
    published_at: now,
    primary_image: null,
    slug: makeSlug(l.dog_name, l.breed, l.city, l.state),
  }))

  const result = await supabaseRequest('POST', 'pending_stud_submissions', rows)
  return Array.isArray(result) ? result : []
}

async function main() {
  if (CLEANUP) {
    console.log('Cleaning up demo seeds...')
    await deleteExistingSeeds()
    console.log('Done.')
    return
  }

  const existing = await countExistingSeeds()

  if (existing > 0 && !FORCE) {
    console.log(`Demo seeds already exist (${existing} rows). Run with --force to re-seed.`)
    return
  }

  if (existing > 0 && FORCE) {
    await deleteExistingSeeds()
  }

  console.log('Inserting 15 demo listings...')
  const inserted = await insertListings()

  if (Array.isArray(inserted)) {
    inserted.forEach((row) => {
      if (row.slug) console.log(`  ✓ ${row.slug}`)
    })
  }

  const finalCount = await countExistingSeeds()
  console.log(`\nDone. Total demo seeds in DB: ${finalCount}`)
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
