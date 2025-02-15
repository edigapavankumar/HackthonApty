import React, { useEffect, useState } from 'react';

// Helper function to convert milliseconds to hours, minutes, and seconds
const convertToHMS = (ms) => {
   let seconds = Math.floor(ms / 1000);
   let hours = Math.floor(seconds / 3600);
   let minutes = Math.floor((seconds % 3600) / 60);
   seconds = seconds % 60;

   return `${hours}h ${minutes}m ${seconds}s`;
};

function Testing() {
   const [currentPage, setCurrentPage] = useState(""); // Current page URL
   const [timeData, setTimeData] = useState([]); // Stores all time data
   const [totalTimeSpent, setTotalTimeSpent] = useState(0); // State for total time spent

   // Function to update time for a specific page in localStorage
   const updateTimeInLocalStorage = (url, time) => {
      const storedData = JSON.parse(localStorage.getItem("websiteTimes")) || {};
      storedData[url] = (storedData[url] || 0) + time;
      localStorage.setItem("websiteTimes", JSON.stringify(storedData));
      setTimeData(Object.entries(storedData).map(([name, time]) => ({ name, time })));
   };

   // Function to reset time for a specific website
   const resetTimeForWebsite = (url) => {
      const storedData = JSON.parse(localStorage.getItem("websiteTimes")) || {};
      delete storedData[url]; // Remove the stored time for the specified website
      localStorage.setItem("websiteTimes", JSON.stringify(storedData));
      setTimeData(Object.entries(storedData).map(([name, time]) => ({ name, time })));
   };

   // Track time every 5 seconds and update the page's time
   useEffect(() => {
      const interval = setInterval(() => {
         const timeSpent = 5000; // Add 5 seconds every 5 seconds

         // Ensure we only track valid website URLs (skip internal Chrome URLs like chrome://extensions/)
         const currentUrl = window.location.href;
         if (currentUrl.startsWith("http://") || currentUrl.startsWith("https://")) {
            setCurrentPage(currentUrl);
            updateTimeInLocalStorage(currentUrl, timeSpent);
         }

         setTotalTimeSpent((prevTime) => prevTime + timeSpent); // Update total time
      }, 5000);

      // Get the current page URL and initialize time tracking
      const currentUrl = window.location.href;
      if (currentUrl.startsWith("http://") || currentUrl.startsWith("https://")) {
         setCurrentPage(currentUrl);
      }

      return () => clearInterval(interval); // Cleanup interval on component unmount
   }, []);

   // Load saved website times from localStorage when component mounts
   useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem("websiteTimes")) || {};
      setTimeData(Object.entries(storedData).map(([name, time]) => ({ name, time })));
   }, []);

   return (
      <div>
         <h3>Website Time Tracker</h3>

         {/* Display current time spent on this page */}
         <h5>Current Time Spent on this Page: {convertToHMS(totalTimeSpent)}</h5>

         <h5>Tracked Website Times</h5>
         <table border="1" style={{ width: '100%', marginTop: '20px', textAlign: 'center' }}>
            <thead>
               <tr>
                  <th>Website</th>
                  <th>Time Spent</th>
                  <th>Actions</th>
               </tr>
            </thead>
            <tbody>
               {timeData.map((site, index) => (
                  <tr key={index}>
                     <td>{site.name}</td>
                     <td>{convertToHMS(site.time)}</td>
                     <td>
                        <button onClick={() => resetTimeForWebsite(site.name)}>
                           Reset Time
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

export default Testing;
