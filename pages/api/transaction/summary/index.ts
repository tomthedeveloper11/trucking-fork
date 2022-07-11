import { NextApiRequest, NextApiResponse } from 'next';
import transactionService from '../../../../src/transaction/transaction.service';
import connectDb from '../../../../src/mongodb/connection';
import _ from 'lodash';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let conn;
  try {
    switch (req.method) {
      case 'GET':
        conn = await connectDb();
        const truckTransactions =
          await transactionService.getGroupedTruckTransactions();
        await conn.close();

        res.status(200).json({ data: truckTransactions });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: _.get(error, 'message') });
  }
}
