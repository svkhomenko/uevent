import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import ClientError from "../types/error";
import { User, Prisma } from "@prisma/client";
import { getPageOptions, getSortOptions } from '../utils/query-options';

const company = prisma.company;

const checkFor = async (key: string, value: string, notId: number = 0) => {
  const exists = await company.findFirst({ 
    where: { 
      [key]: value,
      NOT: {
        id: notId
      } 
    }
  });
  if (exists) {
    throw new ClientError(`The company with this ${key} already exists.`, 400);
  }
};

type TQueryParams = {
  id?: string | string[];
  userId?: string;
  q?: string;
} | undefined;

function getWhereOptions(queryParams: TQueryParams) {
  const where: Prisma.CompanyWhereInput = { AND: [] };
  if (!queryParams) {
    return where;
  }
  const { id, userId, q } = queryParams;

  if (id) {
    let idNum = Array.isArray(id) ? id.map((item) => Number(item)) : [Number(id)];
    Array.isArray(where.AND) && where.AND.push({
      id: { in: idNum },
    });
  }
  if (userId) {
    Array.isArray(where.AND) && where.AND.push({
      userId: Number(userId)
    });
  }
  if (q) {
    Array.isArray(where.AND) && where.AND.push({
      OR: [
        {
          name: {
            contains: q,
          }
        },
        {
          email: {
            contains: q,
          }
        }
      ]
    });
  }
  return where;
}

const getCompanies = async (req: Request, res: Response) => {
  const where = getWhereOptions(req.query);

  const [count, companies] = await prisma.$transaction([
    company.count({ where }),
    company.findMany({
      where,
      ...getPageOptions(req.query),
      ...getSortOptions(req.query, 'id')
    }),
  ]);

  res.header("X-Total-Count", `${count}`).json(companies);
};

const getCompanyById = async (req: Request, res: Response) => {
  const companyId = Number(req.params.id);

  const found = await company.findFirst({
    where: {
      id: companyId
    }
  });
  if (!found) {
    throw new ClientError('The company is not found.', 404);
  }

  res.json(found);
};

const createCompany = async (req: Request, res: Response) => {
	const data = req.body;
	const { id: userId } = req.user as User;

	await checkFor('name', data.name);
	await checkFor('email', data.email);

	const newCompany = await company.create({
    data: {
      ...data,
      picturePath: req?.file?.filename,
      userId,
    },
  });

  res.status(201).json(newCompany);
};

const updateCompany = async (req: Request, res: Response) => {
	let {deleteAvatar, ...data} = req.body;
  const companyId = Number(req.params.id);

	if (data.name) {
    await checkFor('name', data.name, companyId);
  }
	if (data.email) {
    await checkFor('email', data.email, companyId);
  }

  deleteAvatar = deleteAvatar ? null : undefined;

	const updatedCompany = await company.update({
    where: {
      id: companyId
    },
    data: {
      ...data,
      picturePath: req?.file?.filename || deleteAvatar,
    },
  });

  res.status(201).json(updatedCompany);
};

const deleteCompany = async (req: Request, res: Response) => {
  const companyId = Number(req.params.id);

  await company.delete({
    where: { id: companyId },
  });

  res.status(204).send();
};

export { getCompanies, getCompanyById, createCompany, updateCompany, deleteCompany };
