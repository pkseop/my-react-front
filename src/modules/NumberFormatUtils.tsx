

export const toCurrency = (value: number, locale: string, currency: string) =>
new Intl.NumberFormat(locale, {
  style: 'currency',
  currency: currency
}).format(value);

export const toNumberFormat = (value: number) =>
new Intl.NumberFormat().format(value == null ? 0 : value);

export const toByteSize = (fileSizeInBytes: number) => {
  var i = -1;
  var byteUnits = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      
  if (fileSizeInBytes == 0) {
    return '0' + byteUnits[0];
  }
  
  do {
      fileSizeInBytes = fileSizeInBytes / 1024;
      i++;
  } while (fileSizeInBytes > 1024);

  return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
}