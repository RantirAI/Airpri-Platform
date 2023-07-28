export const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december"
]


export const getDateAndTime = (timestamp) => {
    const date = new Date(`${timestamp}`);

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();


    const time = new Date(`${timestamp}`).toLocaleTimeString()


    if (month && day && year && time) {
        return `${month} ${day}, ${year}. ${time}`;
    }

    return 'N/A'
};

export const getDate = (timestamp) => {
    const date = new Date(`${timestamp}`);

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    if (month && day && year)
        return `${day} ${month} ${year}`;

    return 'N/A'
};