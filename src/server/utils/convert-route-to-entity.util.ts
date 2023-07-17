const mapping: Record<string, string> = {
  companies: 'company',
  'company-skills': 'company_skill',
  skills: 'skill',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
