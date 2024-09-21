export const TimeStamp_To_yyyy_mm_dd=(timestamp)=>{
    // Convert timestamp to milliseconds (Unix timestamps are in seconds)
    let date = new Date(timestamp * 1000);

    // Format the date to yyyy-mm-dd
    let formattedDate = date.toISOString().split('T')[0];
    
    console.log(formattedDate);  // Output: "2024-05-16"

    return formattedDate
}