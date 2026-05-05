export interface CiudadConfig {
  slug: string
  nombre: string
  nombreLargo: string // e.g. "Ciudad de México"
  searchName: string  // what to pass to DB city filter
  estado: string
  intro: string
}

export const CIUDADES: CiudadConfig[] = [
  {
    slug: 'cdmx',
    nombre: 'CDMX',
    nombreLargo: 'Ciudad de México',
    searchName: 'Ciudad de Mexico',
    estado: 'CDMX',
    intro: 'Ciudad de México concentra algunos de los mejores criadores caninos del país. Encuentra sementales de French Bulldog, American Bully, Rottweiler y más en la capital.',
  },
  {
    slug: 'guadalajara',
    nombre: 'Guadalajara',
    nombreLargo: 'Guadalajara',
    searchName: 'Guadalajara',
    estado: 'Jalisco',
    intro: 'Guadalajara tiene una comunidad de criadores caninos activa. Encuentra sementales de razas populares en la capital tapatía y municipios del área metropolitana.',
  },
  {
    slug: 'monterrey',
    nombre: 'Monterrey',
    nombreLargo: 'Monterrey',
    searchName: 'Monterrey',
    estado: 'Nuevo León',
    intro: 'Monterrey y el área metropolitana de Nuevo León cuentan con criadores de French Bulldog, American Bully, Cane Corso y otras razas. Contacta al dueño directamente.',
  },
  {
    slug: 'tijuana',
    nombre: 'Tijuana',
    nombreLargo: 'Tijuana',
    searchName: 'Tijuana',
    estado: 'Baja California',
    intro: 'Tijuana tiene acceso a criadores a ambos lados de la frontera. Encuentra sementales caninos disponibles en Tijuana y Baja California con contacto directo.',
  },
  {
    slug: 'cancun',
    nombre: 'Cancún',
    nombreLargo: 'Cancún',
    searchName: 'Cancun',
    estado: 'Quintana Roo',
    intro: 'Cancún y la Riviera Maya concentran criadores de razas exóticas. Encuentra sementales disponibles en Quintana Roo con contacto directo al dueño.',
  },
  {
    slug: 'puebla',
    nombre: 'Puebla',
    nombreLargo: 'Puebla',
    searchName: 'Puebla',
    estado: 'Puebla',
    intro: 'Puebla cuenta con criadores de distintas razas en el centro del país. Busca sementales disponibles en la ciudad de Puebla y municipios cercanos.',
  },
  {
    slug: 'merida',
    nombre: 'Mérida',
    nombreLargo: 'Mérida',
    searchName: 'Merida',
    estado: 'Yucatán',
    intro: 'Mérida y el sureste mexicano tienen una comunidad de criadores en crecimiento. Encuentra sementales caninos en Yucatán con contacto directo.',
  },
  {
    slug: 'leon',
    nombre: 'León',
    nombreLargo: 'León',
    searchName: 'Leon',
    estado: 'Guanajuato',
    intro: 'León, Guanajuato es un centro importante de cría canina en el Bajío. Encuentra sementales de razas populares en León y el corredor industrial.',
  },
  {
    slug: 'queretaro',
    nombre: 'Querétaro',
    nombreLargo: 'Querétaro',
    searchName: 'Queretaro',
    estado: 'Querétaro',
    intro: 'Querétaro tiene una comunidad de criadores caninos activa. Busca sementales disponibles en la ciudad y municipios del estado.',
  },
  {
    slug: 'san-luis-potosi',
    nombre: 'San Luis Potosí',
    nombreLargo: 'San Luis Potosí',
    searchName: 'San Luis Potosi',
    estado: 'San Luis Potosí',
    intro: 'San Luis Potosí conecta criadores del centro-norte de México. Encuentra sementales disponibles en la capital potosina.',
  },
  {
    slug: 'hermosillo',
    nombre: 'Hermosillo',
    nombreLargo: 'Hermosillo',
    searchName: 'Hermosillo',
    estado: 'Sonora',
    intro: 'Hermosillo y el noroeste de México tienen acceso a criadores de razas trabajadoras y de compañía. Encuentra sementales en Sonora.',
  },
  {
    slug: 'culiacan',
    nombre: 'Culiacán',
    nombreLargo: 'Culiacán',
    searchName: 'Culiacan',
    estado: 'Sinaloa',
    intro: 'Culiacán tiene criadores de distintas razas en el norte de México. Encuentra sementales caninos disponibles en Sinaloa.',
  },
  {
    slug: 'mexicali',
    nombre: 'Mexicali',
    nombreLargo: 'Mexicali',
    searchName: 'Mexicali',
    estado: 'Baja California',
    intro: 'Mexicali conecta criadores fronterizos de Baja California. Encuentra sementales disponibles con contacto directo al dueño.',
  },
  {
    slug: 'chihuahua',
    nombre: 'Chihuahua',
    nombreLargo: 'Chihuahua',
    searchName: 'Chihuahua',
    estado: 'Chihuahua',
    intro: 'Chihuahua tiene una larga tradición en cría canina. Encuentra sementales disponibles en la capital y municipios del estado.',
  },
  {
    slug: 'aguascalientes',
    nombre: 'Aguascalientes',
    nombreLargo: 'Aguascalientes',
    searchName: 'Aguascalientes',
    estado: 'Aguascalientes',
    intro: 'Aguascalientes concentra criadores del centro del país. Busca sementales disponibles en la ciudad con contacto directo.',
  },
  {
    slug: 'veracruz',
    nombre: 'Veracruz',
    nombreLargo: 'Veracruz',
    searchName: 'Veracruz',
    estado: 'Veracruz',
    intro: 'Veracruz tiene criadores en el Golfo de México. Encuentra sementales caninos disponibles en el puerto y municipios del estado.',
  },
  {
    slug: 'toluca',
    nombre: 'Toluca',
    nombreLargo: 'Toluca',
    searchName: 'Toluca',
    estado: 'Estado de México',
    intro: 'Toluca y el Estado de México tienen acceso a criadores del área metropolitana de la capital. Encuentra sementales cerca de ti.',
  },
  {
    slug: 'torreon',
    nombre: 'Torreón',
    nombreLargo: 'Torreón',
    searchName: 'Torreon',
    estado: 'Coahuila',
    intro: 'Torreón y La Laguna tienen criadores del norte de México. Busca sementales caninos disponibles en Coahuila y Durango.',
  },
  {
    slug: 'ciudad-juarez',
    nombre: 'Ciudad Juárez',
    nombreLargo: 'Ciudad Juárez',
    searchName: 'Ciudad Juarez',
    estado: 'Chihuahua',
    intro: 'Ciudad Juárez tiene criadores fronterizos con acceso a razas de EE.UU. y México. Encuentra sementales disponibles con contacto directo.',
  },
]

export function getCiudad(slug: string): CiudadConfig | undefined {
  return CIUDADES.find(c => c.slug === slug)
}

export const OTHER_CITIES = [
  { label: 'CDMX', href: '/es/ciudades/cdmx' },
  { label: 'Guadalajara', href: '/es/ciudades/guadalajara' },
  { label: 'Monterrey', href: '/es/ciudades/monterrey' },
  { label: 'Tijuana', href: '/es/ciudades/tijuana' },
  { label: 'Cancún', href: '/es/ciudades/cancun' },
  { label: 'Puebla', href: '/es/ciudades/puebla' },
  { label: 'Mérida', href: '/es/ciudades/merida' },
]
