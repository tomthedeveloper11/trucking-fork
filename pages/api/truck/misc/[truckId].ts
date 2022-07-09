import { NextApiRequest, NextApiResponse } from 'next';
import transactionService from '../../../../src/transaction/transaction.service';
import connectDb from '../../../../src/mongodb/connection';

interface TruckDetailProps extends NextApiRequest {
  query: {
    truckId: string;
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

      const truckId = req.query.truckId;
      const miscTransactions =
        await transactionService.getMiscTruckTransactionsByTruckId(truckId);
      await conn.close();
      res.status(200).json({ data: miscTransactions });
      break;
  }
}
