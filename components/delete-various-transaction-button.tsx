import axios from 'axios';
import { useRouterRefresh } from '../hooks/hooks';
import { TrashIcon } from '@heroicons/react/solid';
import { useToastContext } from '../lib/toast-context';
import { BASE_URL, TruckTransaction } from '../types/common';
import Swal from 'sweetalert2';

interface DeleteTruckTransactionButtonProps {
  transactionId: string;
  disabled?: boolean;
  transaction: TruckTransaction;
}

export default function DeleteVariousTransactionButton({
  transactionId,
  disabled = false,
  transaction,
}: DeleteTruckTransactionButtonProps) {
  const refreshData = useRouterRefresh();
  const addToast = useToastContext();

  async function deleteTruckTransaction() {
    await axios({
      method: 'DELETE',
      url: `${BASE_URL}/api/transaction/${transactionId}`,
    })
      .then(() => {
        refreshData();
      })
      .catch((err) => {
        addToast(err.response.data.message);
      });
  }

  let htmlString = '';

  if (transaction?.containerNo) {
    htmlString = `No. Container: <b>${transaction.containerNo}</b> <br>
    No. Bon: <b>${transaction.invoiceNo}</b> <br>
    Tujuan: <b>${transaction.destination}</b> <br>
    EMKL: <b>${transaction.customer}</b> <br>
    Tanggal: <b>${transaction.date}</b>`;
  } else {
    htmlString = `Deskripsi: <b>${transaction.details}</b> <br>
    Tanggal: <b>${transaction.date}</b>`
  }

  return (
    <TrashIcon
      className={`${
        disabled ? 'text-gray-200' : 'text-red-500 cursor-pointer'
      } h-7`}
      onClick={() => {
        if (!disabled) {
          Swal.fire({
            title: 'Yakin akan menghapus transaksi ini?',
            html: htmlString,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: 'gray',
            confirmButtonText: 'Ya, tolong dihapus!',
          }).then((result) => {
            if (result.isConfirmed) {
              deleteTruckTransaction();
              Swal.fire(
                'Terhapus!',
                'Transaksi ini telah berhasil dihapus',
                'success'
              );
            }
          });
        }
      }}
    />
  );
}
