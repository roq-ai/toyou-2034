import axios from 'axios';
import queryString from 'query-string';
import { CompanySkillInterface, CompanySkillGetQueryInterface } from 'interfaces/company-skill';
import { GetQueryInterface } from '../../interfaces';

export const getCompanySkills = async (query?: CompanySkillGetQueryInterface) => {
  const response = await axios.get(`/api/company-skills${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCompanySkill = async (companySkill: CompanySkillInterface) => {
  const response = await axios.post('/api/company-skills', companySkill);
  return response.data;
};

export const updateCompanySkillById = async (id: string, companySkill: CompanySkillInterface) => {
  const response = await axios.put(`/api/company-skills/${id}`, companySkill);
  return response.data;
};

export const getCompanySkillById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/company-skills/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCompanySkillById = async (id: string) => {
  const response = await axios.delete(`/api/company-skills/${id}`);
  return response.data;
};
