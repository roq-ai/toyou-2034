import { CompanySkillInterface } from 'interfaces/company-skill';
import { GetQueryInterface } from 'interfaces';

export interface SkillInterface {
  id?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  company_skill?: CompanySkillInterface[];

  _count?: {
    company_skill?: number;
  };
}

export interface SkillGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
}
