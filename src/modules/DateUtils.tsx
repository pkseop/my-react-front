import moment from 'moment'

export const toFormatDate = (dateNum: number) => {
  const date = moment(new Date(dateNum))
  return date.format('yyyy-MM-DD HH:mm:ss')
}

export const yyyyMMddToFormatDate = (dateStr: string) => {
  return dateStr.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');

}

export const toDateOnlyFormat = (dateNum: number) => {
  const date = moment(new Date(dateNum))
  return date.format('yyyy-MM-DD')
}

export const currentDateMonth = () => {
  const date = moment(new Date())
  return date.format('yyyy-MM')
}

export const getDiffDayDate = (day: number) => {
  let date = new Date()
  date.setDate(date.getDate() + day)
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  const returnDate = moment(date)
  return returnDate.format('yyyy-MM-DD HH:mm:ss')
}

export const getDiffDayDateHours = (day: number, hours: number) => {
  let date = new Date()
  date.setDate(date.getDate() + day)
  date.setHours(date.getHours() + hours)
  date.setMinutes(0)
  date.setSeconds(0)
  const returnDate = moment(date)
  return returnDate.format('yyyy-MM-DD HH:mm:ss')
}

export const toDateNumber = (dateStr: string) => {
  return Date.parse(dateStr)
}

export const toHHMMSS = (secs: number) => {
  var sec_num = parseInt(secs.toString(), 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor(sec_num / 60) % 60;
  var seconds = sec_num % 60;

  return [hours, minutes, seconds]
      .map((v) => (v < 10 ? "0" + v : v))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
};

export const getGmt = () => {
  const date = new Date();
  return (date.getTimezoneOffset()*-1/60);
}

export const getDiffNowDate = (dateStr: string) => {
  const nowDate = moment(new Date(), 'YYYY-MM-DD')
  const diffDate = moment(new Date(dateStr), 'YYYY-MM-DD')

  return Math.floor(moment.duration(nowDate.diff(diffDate)).asDays())
}

// export const toDuration()

