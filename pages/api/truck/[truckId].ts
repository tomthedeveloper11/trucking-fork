import { NextApiRequest, NextApiResponse } from 'next';
import truckService from '../../../src/truck/truck.service';
import connectDb from '../../../src/mongodb/connection';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import transactionService from '../../../src/transaction/transaction.service';

interface TruckDetailProps extends NextApiRequest {
  headers: {
    authorization: string;
  };
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
  switch (req.method) {
    case 'GET':
      const { authorization } = req.headers;
      const user = jwt.verify(
        authorization,
        process.env.SECRET_KEY
      ) as JwtPayload;

      await connectDb();
      const transactions =
        await transactionService.getTruckTransactionsByTruckId(req.query);

      if (user.role === 'user') {
        transactions.forEach((transaction) => {
          transaction.sellingPrice = 0;
        });
      }

      res.status(200).json({ data: transactions });
      break;

    case 'PUT':
      await connectDb();
      const editTruckPayload = req.body;
      const editTruck = await truckService.editTruck(editTruckPayload);

      res.status(200).json({ data: editTruck });
      break;
  }
}
