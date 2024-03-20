


export const getDate = (date) => {

  let startAt =  date?.toDate()
  const year = startAt.getFullYear();
  const month = String(startAt.getMonth() + 1).padStart(2, '0');
  const day = String(startAt.getDate()).padStart(2, '0');
  let hours = startAt.getHours();
  const minutes = String(startAt.getMinutes()).padStart(2, '0');

  // Convert hours to 12-hour format and determine AM/PM
  const ampm = hours >= 12 ? '오후' : '오전';
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)

  // Format the date string
  return `${year}.${month}.${day} ${ampm} ${hours}:${minutes}`;
}



/**
 * prevDate: 비교할 대상 시간 !!date에는 new Date()형식과 timestamp형식 모두 지원
 * nowDate: 지금 시간. 1초마다 갱신 등 해야될경우 해당 컴포넌트에서 
 *   useEffect(()=>{
    setInterval(()=>setDate(new Date()), 1000)
  },[])
  maxJustNowOnSeconds: "방금" 으로 표시할 최대 초. 
  60으로 해놓으면 비교시간이 1분 안쪽이라면 n초후 가 아닌 "방금" 표시.
  mode: "simple" - n시간 m분 차이일때, n시간 까지만 출력.
 * */
export const dateFromNow = (prevDate, nowDate, maxJustNowOnSeconds, mode="normal") => {

  let date = prevDate

  if((date instanceof Date)===false){
    date = date.toDate()
  }

  // if(date > nowDate){
    const timeLeft = Math.abs(Math.round((date.getTime() - nowDate.getTime()) / 1000))
    if(timeLeft<maxJustNowOnSeconds){
      return "방금"
    } else if (timeLeft <= 60) {
      return `${timeLeft}초`;
    } else if (timeLeft <= 60 * 60) {
      const minutesLeft = Math.floor(timeLeft / 60);
      return `${minutesLeft}분`;
    } else if (timeLeft <= 60 * 60 * 24) {
      const hoursLeft = Math.floor(timeLeft / (60 * 60));
      const minutesLeft = Math.floor((timeLeft % (60 * 60)) / 60);
      if(mode==="simple")
        return `${hoursLeft}시간`
      return `${hoursLeft}시간 ${minutesLeft}분`;
    } else {
      const daysLeft = Math.floor(timeLeft / (60 * 60 * 24));
      return `${daysLeft}일`;
    }
  // }
}