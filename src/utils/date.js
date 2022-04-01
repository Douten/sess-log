const getDate = (dateObject) => {
  return dateObject.toLocaleString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const getSetTime = (dateObject) => {
  return dateObject.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

const getDateIndex = (session, date) => {
  return session.findIndex(storedDate =>  storedDate[0] === date);
}

export { getDate, getSetTime, getDateIndex };