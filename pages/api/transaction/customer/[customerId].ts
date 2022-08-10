import { NextApiRequest, NextApiResponse } from 'next';
import transactionService from '../../../../src/transaction/transaction.service';
import connectDb from '../../../../src/mongodb/connection';
import * as jwt from 'jsonwebtoken';
import { CookieValueTypes } from 'cookies-next';

interface customerDetailProps extends NextApiRequest {
  query: {
    customerId: string;
    startDate: Date;
    endDate: Date;
  };
}

export default async function handler(
  req: customerDetailProps,
  res: NextApiResponse
) {
  let conn;
  switch (req.method) {
    case 'GET':
      const { access_token } = req.headers;
      const user = jwt.decode(access_token, process.env.SECRET_KEY);

      conn = await connectDb();

      const transactions =
        await transactionService.getTruckTransactionsByCustomerId(req.query);
      await conn.close();
      
      if (user?.role === 'user') {
        transactions.forEach((transaction) => {
          transaction.sellingPrice = 0;
        });
      }
    
      res.status(200).json({ data: transactions });
      break;
  }
}
