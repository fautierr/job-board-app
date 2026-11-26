export type MockJobCategory =
  | 'TECHNOLOGY_SYSTEMS'
  | 'ADMINISTRATION'
  | 'SALES_COMMERCIAL'
  | 'CUSTOMER_SERVICE'
  | 'MARKETING_COMMUNICATION'
  | 'DESIGN_MULTIMEDIA'
  | 'HUMAN_RESOURCES'
  | 'FINANCE_ACCOUNTING'
  | 'LOGISTICS_TRANSPORT'
  | 'PRODUCTION_OPERATIONS'
  | 'GASTRONOMY_TOURISM'
  | 'HEALTH'
  | 'EDUCATION'
  | 'CONSTRUCTION_TRADES'
  | 'LEGAL'
  | 'OTHER'

export type MockSeniority =
  | 'NO_EXPERIENCE'
  | 'TRAINEE'
  | 'JUNIOR'
  | 'SEMI_SENIOR'
  | 'SENIOR'
  | 'LEADER_MANAGER'

export type MockWorkMode = 'REMOTE' | 'ONSITE' | 'HYBRID'
export type MockWorkday = 'FULL_TIME' | 'PART_TIME'
export type MockContractType =
  | 'EMPLOYMENT'
  | 'TEMPORARY_CONTRACT'
  | 'FREELANCE_PROJECT'
  | 'INTERNSHIP'

/** El mock solo representa postulaciones ya enviadas por el candidato. */
export type MockAppliedState = 'aplicada' | null

export interface MockJob {
  id: string
  title: string
  description: string
  category: MockJobCategory
  seniority: MockSeniority
  workMode: MockWorkMode
  workday: MockWorkday
  contractType: MockContractType
  status: 'PUBLISHED'
  createdAt: string
  updatedAt: string
  companyName: string
  applied: MockAppliedState
}

export interface FilterOption {
  value: string
  label: string
}

export const mockCategories: FilterOption[] = [
  { value: 'TECHNOLOGY_SYSTEMS', label: 'Tecnología y sistemas' },
  { value: 'ADMINISTRATION', label: 'Administración' },
  { value: 'SALES_COMMERCIAL', label: 'Ventas y comercial' },
  { value: 'CUSTOMER_SERVICE', label: 'Atención al cliente' },
  { value: 'MARKETING_COMMUNICATION', label: 'Marketing y comunicación' },
  { value: 'DESIGN_MULTIMEDIA', label: 'Diseño y multimedia' },
  { value: 'HUMAN_RESOURCES', label: 'Recursos humanos' },
  { value: 'FINANCE_ACCOUNTING', label: 'Finanzas y contabilidad' },
  { value: 'LOGISTICS_TRANSPORT', label: 'Logística y transporte' },
  { value: 'PRODUCTION_OPERATIONS', label: 'Producción y operaciones' },
  { value: 'GASTRONOMY_TOURISM', label: 'Gastronomía y turismo' },
  { value: 'HEALTH', label: 'Salud' },
  { value: 'EDUCATION', label: 'Educación' },
  { value: 'CONSTRUCTION_TRADES', label: 'Construcción y oficios' },
  { value: 'LEGAL', label: 'Legal' },
  { value: 'OTHER', label: 'Otros' },
]

export const mockSeniorities: FilterOption[] = [
  { value: 'NO_EXPERIENCE', label: 'Sin experiencia' },
  { value: 'TRAINEE', label: 'Trainee' },
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'SEMI_SENIOR', label: 'Semi senior' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'LEADER_MANAGER', label: 'Líder / Manager' },
]

export const mockWorkModes: FilterOption[] = [
  { value: 'REMOTE', label: 'Remoto' },
  { value: 'ONSITE', label: 'Presencial' },
  { value: 'HYBRID', label: 'Híbrido' },
]

export const mockWorkdays: FilterOption[] = [
  { value: 'FULL_TIME', label: 'Completa' },
  { value: 'PART_TIME', label: 'Media jornada' },
]

export const mockContractTypes: FilterOption[] = [
  { value: 'EMPLOYMENT', label: 'Empleo' },
  { value: 'TEMPORARY_CONTRACT', label: 'Contrato temporal' },
  { value: 'FREELANCE_PROJECT', label: 'Proyecto freelance' },
  { value: 'INTERNSHIP', label: 'Pasantía' },
]

export const categoryLabels: Record<MockJobCategory, string> = Object.fromEntries(
  mockCategories.map(({ value, label }) => [value, label]),
) as Record<MockJobCategory, string>

export const seniorityLabels: Record<MockSeniority, string> = Object.fromEntries(
  mockSeniorities.map(({ value, label }) => [value, label]),
) as Record<MockSeniority, string>

export const workModeLabels: Record<MockWorkMode, string> = Object.fromEntries(
  mockWorkModes.map(({ value, label }) => [value, label]),
) as Record<MockWorkMode, string>

export const workdayLabels: Record<MockWorkday, string> = Object.fromEntries(
  mockWorkdays.map(({ value, label }) => [value, label]),
) as Record<MockWorkday, string>

export const contractTypeLabels: Record<MockContractType, string> =
  Object.fromEntries(
    mockContractTypes.map(({ value, label }) => [value, label]),
  ) as Record<MockContractType, string>

export const mockJobs: MockJob[] = [
  {
    id: '3f8b1c2e-9a44-4f6b-8d21-0c7e5a9b1f01',
    title: 'Frontend Engineer',
    description:
      'Buscamos una persona con criterio técnico para construir interfaces claras y accesibles en React y TypeScript. Trabajarás con producto y diseño en un equipo pequeño, con revisiones semanales y espacio para proponer mejoras.',
    category: 'TECHNOLOGY_SYSTEMS',
    seniority: 'SENIOR',
    workMode: 'REMOTE',
    workday: 'FULL_TIME',
    contractType: 'EMPLOYMENT',
    status: 'PUBLISHED',
    createdAt: '2026-11-24T09:00:00.000Z',
    updatedAt: '2026-11-24T09:00:00.000Z',
    companyName: 'Nube Studio',
    applied: null,
  },
  {
    id: '7a2d5f10-4c8b-4e93-b6a1-2d5e8f0c3a12',
    title: 'Product Designer',
    description:
      'Diseñarás productos para equipos de salud, desde la investigación hasta la entrega. El equipo es horizontal y trabaja con usuarios reales para que cada decisión pueda implementarse sin perder intención.',
    category: 'DESIGN_MULTIMEDIA',
    seniority: 'SEMI_SENIOR',
    workMode: 'HYBRID',
    workday: 'FULL_TIME',
    contractType: 'EMPLOYMENT',
    status: 'PUBLISHED',
    createdAt: '2026-11-23T14:30:00.000Z',
    updatedAt: '2026-11-23T14:30:00.000Z',
    companyName: 'Lumen Health',
    applied: null,
  },
  {
    id: 'b91e6c43-8d27-4a15-9f0b-6c3a7d2e5819',
    title: 'Data Analyst',
    description:
      'Apoyarás al equipo de datos en reportes y exploraciones para entender el comportamiento de nuestros usuarios. Es una posición temporal de seis meses con acompañamiento y formación desde el primer día.',
    category: 'FINANCE_ACCOUNTING',
    seniority: 'JUNIOR',
    workMode: 'REMOTE',
    workday: 'PART_TIME',
    contractType: 'TEMPORARY_CONTRACT',
    status: 'PUBLISHED',
    createdAt: '2026-11-22T11:00:00.000Z',
    updatedAt: '2026-11-22T11:00:00.000Z',
    companyName: 'Cielo Fintech',
    applied: null,
  },
  {
    id: 'c4d7a820-1e36-4b9f-a5c8-90f2b6d1e743',
    title: 'Backend Engineer (Node.js)',
    description:
      'Evolucionaremos servicios que procesan miles de eventos de logística por día. Participarás en decisiones de arquitectura y en el diagnóstico de incidencias en producción.',
    category: 'TECHNOLOGY_SYSTEMS',
    seniority: 'SENIOR',
    workMode: 'ONSITE',
    workday: 'FULL_TIME',
    contractType: 'EMPLOYMENT',
    status: 'PUBLISHED',
    createdAt: '2026-11-21T08:45:00.000Z',
    updatedAt: '2026-11-21T08:45:00.000Z',
    companyName: 'Río Labs',
    applied: 'aplicada',
  },
  {
    id: 'd6f0b9a1-3c52-4d78-8e14-7a9c0b2f5e36',
    title: 'Product Manager',
    description:
      'Liderarás un squad enfocado en la experiencia del cliente en procesos de transformación digital. Serás responsable del roadmap, las prioridades y la medición de cada entrega.',
    category: 'ADMINISTRATION',
    seniority: 'LEADER_MANAGER',
    workMode: 'HYBRID',
    workday: 'FULL_TIME',
    contractType: 'EMPLOYMENT',
    status: 'PUBLISHED',
    createdAt: '2026-11-19T16:20:00.000Z',
    updatedAt: '2026-11-19T16:20:00.000Z',
    companyName: 'Marea Digital',
    applied: null,
  },
  {
    id: 'e83c1f47-6b90-42ad-95e2-1f7a4d0b8c25',
    title: 'UX Researcher',
    description:
      'Acompañarás tres proyectos en paralelo realizando entrevistas y tests de usabilidad. La colaboración es remota, con dos reuniones sincrónicas por semana.',
    category: 'DESIGN_MULTIMEDIA',
    seniority: 'SENIOR',
    workMode: 'REMOTE',
    workday: 'PART_TIME',
    contractType: 'FREELANCE_PROJECT',
    status: 'PUBLISHED',
    createdAt: '2026-11-19T10:10:00.000Z',
    updatedAt: '2026-11-19T10:10:00.000Z',
    companyName: 'Norte Design',
    applied: null,
  },
  {
    id: 'f25a7d63-0b48-4c91-8e37-6d1a9c4f2b80',
    title: 'Marketing de Contenidos',
    description:
      'Contaremos la historia de nuestra marca de cuidado personal en blog, redes y newsletters. El rol combina producción de contenido, coordinación editorial y análisis básico de resultados.',
    category: 'MARKETING_COMMUNICATION',
    seniority: 'SEMI_SENIOR',
    workMode: 'HYBRID',
    workday: 'PART_TIME',
    contractType: 'EMPLOYMENT',
    status: 'PUBLISHED',
    createdAt: '2026-11-12T13:00:00.000Z',
    updatedAt: '2026-11-12T13:00:00.000Z',
    companyName: 'Valle Verde',
    applied: null,
  },
  {
    id: 'a10e4b58-7d29-4f36-b1c0-8e5d2a7f934c',
    title: 'Analista de Operaciones',
    description:
      'Apoyarás el seguimiento de entregas y la carga de información en nuestros sistemas. El puesto incluye una mentoría formal de tres meses con posibilidad de incorporación.',
    category: 'LOGISTICS_TRANSPORT',
    seniority: 'TRAINEE',
    workMode: 'ONSITE',
    workday: 'FULL_TIME',
    contractType: 'INTERNSHIP',
    status: 'PUBLISHED',
    createdAt: '2026-11-12T09:30:00.000Z',
    updatedAt: '2026-11-12T09:30:00.000Z',
    companyName: 'Puerto Logística',
    applied: null,
  },
]
