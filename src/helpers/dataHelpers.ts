export const formatForApi = (date: Date): string => {
  return date.toISOString().split('T')[0]
}
