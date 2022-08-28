import moment from 'moment';

export const formatDate = (date: Date) => {
  moment.locale('id');
  return moment(date).utcOffset(7, false).format('LL');
};

export const formatRupiah = (number = 0, show_currency = true) => {
  const formatted_number = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);

  if (show_currency === false) return formatted_number.replace(/Rp /, '');
  return formatted_number;
};

export const indexPlusOne = (index: number) => {
  return index + 1;
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};