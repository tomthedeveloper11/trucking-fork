import axios from 'axios';
import { useRouterRefresh } from '../hooks/hooks';
import { TrashIcon } from '@heroicons/react/solid';
import { useToastContext } from '../lib/toast-context';
import { BASE_URL } from '../types/common';
import Swal from 'sweetalert2'

interface DeleteTruckTransactionButtonProps {
  transactionId: string;
  disabled?: boolean;
}

export default function DeleteVariousTransactionButton({
  transactionId,
  disabled = false,
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

  return (
    <TrashIcon
      className={`${
        disabled ? 'text-gray-200' : 'text-red-500 cursor-pointer'
      } h-7`}
      onClick={() => {
        if (!disabled) {
          Swal.fire({
            title: 'Yakin akan menghapus transaksi ini?',
            text: "Transaksi ini tidak akan bisa dikembalikan setelah dihapus",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: 'gray',
            confirmButtonText: 'Ya, tolong dihapus!'
          }).then((result) => {
            if (result.isConfirmed) {
              deleteTruckTransaction();
              Swal.fire(
                'Terhapus!',
                'Transaksi ini telah berhasil dihapus',
                'success'
              )
            }
          })
          
        }
      }}
    />
  );
}
