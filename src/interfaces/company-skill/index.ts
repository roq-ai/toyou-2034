import { CompanyInterface } from 'interfaces/company';
import { SkillInterface } from 'interfaces/skill';
import { GetQueryInterface } from 'interfaces';

export interface CompanySkillInterface {
  id?: string;
  company_id: string;
  skill_id: string;
  created_at?: any;
  updated_at?: any;

  company?: CompanyInterface;
  skill?: SkillInterface;
  _count?: {};
}

export interface CompanySkillGetQueryInterface extends GetQueryInterface {
  id?: string;
  company_id?: string;
  skill_id?: string;
}
