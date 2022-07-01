import { NextApiRequest, NextApiResponse } from 'next';
import transactionService from '../../../../src/transaction/transaction.service';
import connectDb from '../../../../src/mongodb/connection';

interface customerDetailProps extends NextApiRequest {
  query: {
    customerId: string;
  };
}

export default async function handler(
  req: customerDetailProps,
  res: NextApiResponse
) {
  let conn;
  switch (req.method) {
    case 'GET':
      conn = await connectDb();

      const customerId = req.query.customerId;
      const transactions =
        await transactionService.getTruckTransactionsByCustomerId(customerId);
      await conn.close();
      res.status(200).json({ data: transactions });
      break;
  }
}
