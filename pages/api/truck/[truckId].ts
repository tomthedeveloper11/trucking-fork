import { NextApiRequest, NextApiResponse } from 'next';
import transactionService from '../../../src/transaction/transaction.service';
import connectDb from '../../../src/mongodb/connection';

interface TruckDetailProps extends NextApiRequest {
  query: {
    truckId: string;
    startDate: Date;
    endDate: Date;
  };
}

export default async function handler(
  req: TruckDetailProps,
  res: NextApiResponse
) {
  let conn;
  switch (req.method) {
    case 'GET':
      conn = await connectDb();
      const transactions =
        await transactionService.getTruckTransactionsByTruckId(req.query);
      await conn.close();
      res.status(200).json({ data: transactions });
      break;
  }
}
