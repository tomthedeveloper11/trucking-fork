import { NextApiRequest, NextApiResponse } from 'next';
import transactionService from '../../../../src/transaction/transaction.service';
import connectDb from '../../../../src/mongodb/connection';
import _ from 'lodash';
import initMiddleware from '../../../../src/middlewares/init-middleware';
import { check, validationResult } from 'express-validator';
import validateMiddleware from '../../../../src/middlewares/validate-middleware';
import userAuthenticationMiddleware from '../../../../src/middlewares/user-authentication-middleware';

interface TransactionSummaryRequest extends NextApiRequest {
  query: {
    startDate: Date;
    endDate: Date;
  };
}

const transactionSummaryValidator = initMiddleware(
  validateMiddleware(
    [
      check('month').isString().isLength({ min: 1 }).exists(),
      check('year').isString().isLength({ min: 4 }).exists(),
    ],
    validationResult
  )
);

const userAuthentication = initMiddleware(userAuthenticationMiddleware());

export default async function handler(
  req: TransactionSummaryRequest,
  res: NextApiResponse
) {
  let conn;
  try {
    switch (req.method) {
      case 'GET':
        // await userAuthentication(req, res);

        conn = await connectDb();
        const transactions = await transactionService.getTotalSummary(
          req.query
        );
        await conn.close();

        res.status(200).json({ data: transactions });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: _.get(error, 'message') });
  }
}
