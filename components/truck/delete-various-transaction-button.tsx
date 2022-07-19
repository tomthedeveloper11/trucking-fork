import axios from 'axios';
import { TransactionType, TruckTransaction } from '../../types/common';
import { useRouterRefresh } from '../../hooks/hooks';
import { TrashIcon } from '@heroicons/react/solid';
import { useToastContext } from '../../lib/toast-context';

export default function DeleteVariousTransactionButton({ transactionId }) {
  const refreshData = useRouterRefresh();
  const addToast = useToastContext();

  async function deleteTruckTransaction() {
    await axios({
      method: 'DELETE',
      url: `http://localhost:3000/api/transaction/${transactionId}`,
    })
      .then(() => {
        refreshData();
      })
      .catch((err) => {
        addToast(err.response.data.message);
      });
  }

  return (
    <TrashIcon
      className="h-7 cursor-pointer text-red-500"
      onClick={deleteTruckTransaction}
    />
  );
}
