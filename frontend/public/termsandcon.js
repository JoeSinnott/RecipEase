window.addEventListener('DOMContentLoaded', (event) => {
    console.log("Checking if terms are accepted...");
    
    // Check if the user has already accepted the terms
    const hasAcceptedTerms = localStorage.getItem('hasAcceptedTerms');
    console.log("termsAccepted:", hasAcceptedTerms);
  
    // If the user has not accepted the terms yet
    if (hasAcceptedTerms !== 'true') {
      console.log("Showing terms and conditions modal.");
  
      // Show the modal by changing the display property to block
      const modal = document.querySelector('.modal');
      modal.style.display = 'block'; // Show the modal
  
      // Function to handle when the user clicks "Accept"
      const acceptButton = document.getElementById('accept-terms');
      if (acceptButton) {
        acceptButton.addEventListener('click', () => {
          console.log("Accept button clicked");
  
          // Mark terms as accepted in localStorage
          localStorage.setItem('hasAcceptedTerms', 'true');
          console.log("LocalStorage after accepting:", localStorage.getItem('hasAcceptedTerms'));
  
          // Hide the modal when accepted
          modal.style.display = 'none';
        });
      } else {
        console.log("Accept button not found");
      }
  
      // Function to handle when the user clicks "Close"
      const closeButton = document.getElementById('closeBtn');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          console.log("Close button clicked");
          modal.style.display = 'none';  // Hide the modal when closed
        });
      } else {
        console.log("Close button not found");
      }
    } else {
      // Debugging log if terms have already been accepted
      console.log("Terms have already been accepted.");
    }
  });