import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { companySkillValidationSchema } from 'validationSchema/company-skills';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.company_skill
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCompanySkillById();
    case 'PUT':
      return updateCompanySkillById();
    case 'DELETE':
      return deleteCompanySkillById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCompanySkillById() {
    const data = await prisma.company_skill.findFirst(convertQueryToPrismaUtil(req.query, 'company_skill'));
    return res.status(200).json(data);
  }

  async function updateCompanySkillById() {
    await companySkillValidationSchema.validate(req.body);
    const data = await prisma.company_skill.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCompanySkillById() {
    const data = await prisma.company_skill.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
