document.addEventListener("DOMContentLoaded", function () {
  // Select relevant DOM elements 
  const search = document.getElementById("search");
  const usernameInp = document.getElementById("user-inp");
  const stats = document.querySelector(".stats");
  const easy = document.querySelector(".easy");
  const medium = document.querySelector(".medium");
  const hard = document.querySelector(".hard");
  const easyLabel = document.getElementById("easyLabel");
  const MediumLabel = document.getElementById("mediumLabel");
  const hardLabel = document.getElementById("hardLabel");

  // Function to validate the username input
  function validUserName(username) {
    // Check if the username is empty or contains only whitespace
    if (!username || username.trim() === "") {
      alert("Please enter a valid user name");
      return false;
    }
    // Ensure the username contains only alphanumeric characters, hyphens, or underscores (up to 20 characters)
    const regex = /^[a-zA-Z0-9_-]{0,20}$/;
    const isMatch = regex.test(username);
    if (!isMatch) {
      alert("UserName is not valid");
    }
    return isMatch;
  }

  // Function to fetch and display user details from the API
  async function userDetail(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
    try {
      search.textContent = "searching..."; 
      search.disabled = true; // Disable the search button to prevent multiple clicks

      const res = await fetch(url); // Fetch data from the API
      if (!res.ok) {
        throw new Error(`Couldn't fetch user details. Status: ${res.status}`);
      }
      const parsedData = await res.json(); 

      displayData(parsedData); // Call function to display user stats
    } catch (error) {
      stats.innerHTML = `<p>Error fetching data</p>`;
      console.error('Error fetching data: ', error); 
    } finally {
      search.textContent = "search"; 
      search.disabled = false; // Re-enable the search button
    }
  }

  // Function to update the progress circle and label
  function updateProgress(solved, total, label, circle) {
    const degree = (solved / total) * 100; 
    circle.style.setProperty("--progress-degree", `${degree}%`); // Update the CSS custom property for circle progress
    label.textContent = `${solved}/${total}`; 
  }

  function displayData(parsedData) {
    updateProgress(parsedData.easySolved, parsedData.totalEasy, easyLabel, easy); 
    updateProgress(parsedData.mediumSolved, parsedData.totalMedium, MediumLabel, medium); 
    updateProgress(parsedData.hardSolved, parsedData.totalHard, hardLabel, hard);
  }

  // Event listener for the search button click
  search.addEventListener("click", function () {
    const username = usernameInp ? usernameInp.value.trim() : "";
    if (validUserName(username)) {
      userDetail(username); // Fetch and display user details if valid
    }
  });
});
