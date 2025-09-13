document.addEventListener('DOMContentLoaded', function() {
  console.log('Auth handler loaded');
  
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  
  const handleSubmit = async (event) => {
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Check if this is an API request or form submission
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData);
    
    console.log("Form data:", formObject);
    
    // Show loading state
    submitButton.textContent = 'Please wait...';
    submitButton.disabled = true;
    
    try {
      // Determine endpoint based on form
      const endpoint = form.id === 'signup-form' ? '/api/auth/signup' : '/api/auth/login';
      
      console.log("Submitting to:", endpoint);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formObject)
      });
      
      console.log("Response status:", response.status);
      
      // Parse response even if it's an error
      const data = await response.json();
      console.log("Response data:", data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }
      
      // Store token and basic user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user || { 
        id: data.userId, 
        username: formObject.username || '', 
        email: formObject.email || ''
      }));
      
      console.log("Login successful, redirecting to dashboard");
      
      // Redirect to MyStuff page
      window.location.href = '/myStuff/myStuff.html';
    } catch (error) {
      console.error('Authentication error:', error);
      // Restore button
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      
      // Display error message
      const errorElement = form.id === 'signup-form' ? 
        document.getElementById('signup-error') : 
        document.getElementById('login-error');
        
      if (errorElement) {
        errorElement.style.display = 'block';
        errorElement.textContent = error.message || 'Authentication failed';
      } else {
        alert(error.message || 'Authentication failed');
      }
    }
  };
  
  if (loginForm) {
    console.log("Login form found, attaching event listener");
    loginForm.addEventListener('submit', handleSubmit);
  }
  
  if (signupForm) {
    console.log("Signup form found, attaching event listener");
    signupForm.addEventListener('submit', handleSubmit);
  }
});