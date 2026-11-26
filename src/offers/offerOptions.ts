import type {
  ContractType,
  JobCategory,
  OfferFilterKey,
  Seniority,
  WorkMode,
  Workday,
} from './types'

export interface FilterOption<T extends string = string> {
  value: T
  label: string
}

export const categoryLabels = {
  TECHNOLOGY_SYSTEMS: 'Tecnología y sistemas',
  ADMINISTRATION: 'Administración',
  SALES_COMMERCIAL: 'Ventas y comercial',
  CUSTOMER_SERVICE: 'Atención al cliente',
  MARKETING_COMMUNICATION: 'Marketing y comunicación',
  DESIGN_MULTIMEDIA: 'Diseño y multimedia',
  HUMAN_RESOURCES: 'Recursos humanos',
  FINANCE_ACCOUNTING: 'Finanzas y contabilidad',
  LOGISTICS_TRANSPORT: 'Logística y transporte',
  PRODUCTION_OPERATIONS: 'Producción y operaciones',
  GASTRONOMY_TOURISM: 'Gastronomía y turismo',
  HEALTH: 'Salud',
  EDUCATION: 'Educación',
  CONSTRUCTION_TRADES: 'Construcción y oficios',
  LEGAL: 'Legal',
  OTHER: 'Otros',
} satisfies Record<JobCategory, string>

export const seniorityLabels = {
  NO_EXPERIENCE: 'Sin experiencia',
  TRAINEE: 'Trainee',
  JUNIOR: 'Junior',
  SEMI_SENIOR: 'Semi senior',
  SENIOR: 'Senior',
  LEADER_MANAGER: 'Líder / Manager',
} satisfies Record<Seniority, string>

export const workModeLabels = {
  REMOTE: 'Remoto',
  ONSITE: 'Presencial',
  HYBRID: 'Híbrido',
} satisfies Record<WorkMode, string>

export const workdayLabels = {
  FULL_TIME: 'Completa',
  PART_TIME: 'Media jornada',
} satisfies Record<Workday, string>

export const contractTypeLabels = {
  EMPLOYMENT: 'Empleo',
  TEMPORARY_CONTRACT: 'Contrato temporal',
  FREELANCE_PROJECT: 'Proyecto freelance',
  INTERNSHIP: 'Pasantía',
} satisfies Record<ContractType, string>

export const categoryOptions: readonly FilterOption<JobCategory>[] = [
  { value: 'TECHNOLOGY_SYSTEMS', label: categoryLabels.TECHNOLOGY_SYSTEMS },
  { value: 'ADMINISTRATION', label: categoryLabels.ADMINISTRATION },
  { value: 'SALES_COMMERCIAL', label: categoryLabels.SALES_COMMERCIAL },
  { value: 'CUSTOMER_SERVICE', label: categoryLabels.CUSTOMER_SERVICE },
  { value: 'MARKETING_COMMUNICATION', label: categoryLabels.MARKETING_COMMUNICATION },
  { value: 'DESIGN_MULTIMEDIA', label: categoryLabels.DESIGN_MULTIMEDIA },
  { value: 'HUMAN_RESOURCES', label: categoryLabels.HUMAN_RESOURCES },
  { value: 'FINANCE_ACCOUNTING', label: categoryLabels.FINANCE_ACCOUNTING },
  { value: 'LOGISTICS_TRANSPORT', label: categoryLabels.LOGISTICS_TRANSPORT },
  { value: 'PRODUCTION_OPERATIONS', label: categoryLabels.PRODUCTION_OPERATIONS },
  { value: 'GASTRONOMY_TOURISM', label: categoryLabels.GASTRONOMY_TOURISM },
  { value: 'HEALTH', label: categoryLabels.HEALTH },
  { value: 'EDUCATION', label: categoryLabels.EDUCATION },
  { value: 'CONSTRUCTION_TRADES', label: categoryLabels.CONSTRUCTION_TRADES },
  { value: 'LEGAL', label: categoryLabels.LEGAL },
  { value: 'OTHER', label: categoryLabels.OTHER },
]

export const seniorityOptions: readonly FilterOption<Seniority>[] = [
  { value: 'NO_EXPERIENCE', label: seniorityLabels.NO_EXPERIENCE },
  { value: 'TRAINEE', label: seniorityLabels.TRAINEE },
  { value: 'JUNIOR', label: seniorityLabels.JUNIOR },
  { value: 'SEMI_SENIOR', label: seniorityLabels.SEMI_SENIOR },
  { value: 'SENIOR', label: seniorityLabels.SENIOR },
  { value: 'LEADER_MANAGER', label: seniorityLabels.LEADER_MANAGER },
]

export const workModeOptions: readonly FilterOption<WorkMode>[] = [
  { value: 'REMOTE', label: workModeLabels.REMOTE },
  { value: 'ONSITE', label: workModeLabels.ONSITE },
  { value: 'HYBRID', label: workModeLabels.HYBRID },
]

export const workdayOptions: readonly FilterOption<Workday>[] = [
  { value: 'FULL_TIME', label: workdayLabels.FULL_TIME },
  { value: 'PART_TIME', label: workdayLabels.PART_TIME },
]

export const contractTypeOptions: readonly FilterOption<ContractType>[] = [
  { value: 'EMPLOYMENT', label: contractTypeLabels.EMPLOYMENT },
  { value: 'TEMPORARY_CONTRACT', label: contractTypeLabels.TEMPORARY_CONTRACT },
  { value: 'FREELANCE_PROJECT', label: contractTypeLabels.FREELANCE_PROJECT },
  { value: 'INTERNSHIP', label: contractTypeLabels.INTERNSHIP },
]

export const offerFilterKeys = [
  'category',
  'seniority',
  'workMode',
  'workday',
  'contractType',
] as const satisfies readonly OfferFilterKey[]

export const filterLabels: Record<OfferFilterKey, string> = {
  category: 'Categoría',
  seniority: 'Experiencia',
  workMode: 'Modalidad',
  workday: 'Jornada',
  contractType: 'Contrato',
}

export function optionsForFilter(key: OfferFilterKey): readonly FilterOption[] {
  switch (key) {
    case 'category':
      return categoryOptions
    case 'seniority':
      return seniorityOptions
    case 'workMode':
      return workModeOptions
    case 'workday':
      return workdayOptions
    case 'contractType':
      return contractTypeOptions
  }
}

export function isCategory(value: unknown): value is JobCategory {
  return typeof value === 'string' && categoryOptions.some((option) => option.value === value)
}

export function isSeniority(value: unknown): value is Seniority {
  return typeof value === 'string' && seniorityOptions.some((option) => option.value === value)
}

export function isWorkMode(value: unknown): value is WorkMode {
  return typeof value === 'string' && workModeOptions.some((option) => option.value === value)
}

export function isWorkday(value: unknown): value is Workday {
  return typeof value === 'string' && workdayOptions.some((option) => option.value === value)
}

export function isContractType(value: unknown): value is ContractType {
  return (
    typeof value === 'string' && contractTypeOptions.some((option) => option.value === value)
  )
}
