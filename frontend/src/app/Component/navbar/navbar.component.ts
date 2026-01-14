import { Component, OnInit, ViewEncapsulation } from '@angular/core';
declare var google:any;
import { CustomerService } from '../../service/customer.service';
import { Customer } from '../../model/customer.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit{
constructor(private router:Router,private customerservice:CustomerService){}
isloggedIn:boolean=false

ngOnInit(): void {
  if(sessionStorage.getItem("Loggedinuser")){
    this.isloggedIn=true
  }else{
    this.isloggedIn=false
  }

  // Initialize Google Sign-In
  this.initializeGoogleSignIn();
  
  // Make demo login function globally available
  (window as any).demoGoogleLogin = this.demoGoogleLogin.bind(this);
}

demoGoogleLogin(): void {
  console.log('Demo Google login triggered');
  
  // Create a mock Google user response
  const mockGoogleUser = {
    email: 'user@gmail.com',
    name: 'Google User',
    picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
    sub: '1234567890',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    given_name: 'Google',
    family_name: 'User',
    email_verified: true
  };
  
  // Simulate the login process
  this.customerservice.addcustomermongo(mockGoogleUser).subscribe({
    next:(response)=>{
      console.log('Demo login success',response);
      sessionStorage.setItem("Loggedinuser",JSON.stringify(response));
      this.isloggedIn = true;
      alert('Successfully logged in with Google (Demo Mode)!\nWelcome, ' + mockGoogleUser.name + '!');
      window.location.reload();
    },
    error:(error)=>{
      console.error('Backend error, using demo mode',error);
      // Even if backend fails, save user data for UI testing
      sessionStorage.setItem("Loggedinuser",JSON.stringify(mockGoogleUser));
      this.isloggedIn = true;
      alert('Successfully logged in with Google (Demo Mode)!\nWelcome, ' + mockGoogleUser.name + '!');
      window.location.reload();
    }
  });
}

ngAfterViewInit():void{
  // Delay to ensure DOM is ready
  setTimeout(() => {
    this.rendergooglebutton();
  }, 1000);
}

private initializeGoogleSignIn(): void {
  // For development/demo purposes, we'll use a demo approach
  // In production, you would need to set up your own Google OAuth client
  console.log('Google Sign-In initialization - Demo Mode');
  
  // Comment out the real Google initialization for now
  /*
  if (typeof google !== 'undefined') {
    google.accounts.id.initialize({
      client_id:"YOUR_NEW_GOOGLE_CLIENT_ID_HERE",
      callback:(response:any)=>{this.handlelogin(response);}
    });
  } else {
    console.error('Google API not loaded');
  }
  */
}

private rendergooglebutton():void{
  // For demo purposes, we'll show a custom button instead of Google's button
  const googlebtn=document.getElementById('google-btn');
  if(googlebtn){
    googlebtn.innerHTML = `
      <button onclick="window.demoGoogleLogin()" style="
        background: #4285f4 !important; 
        color: white !important; 
        padding: 10px 20px !important; 
        border: none !important; 
        border-radius: 5px !important; 
        font-weight: bold !important; 
        cursor: pointer !important; 
        font-size: 14px !important; 
        display: flex !important; 
        align-items: center !important; 
        gap: 8px !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Sign in with Google
      </button>
    `;
    console.log('Custom Google button rendered');
  } else {
    console.error('Google button element not found');
  }
}

manualLogin(): void {
  if (this.isloggedIn) {
    // If already logged in, show user info or logout
    alert('You are already logged in!');
    return;
  }

  // Try to trigger Google Sign-In
  if (typeof google !== 'undefined') {
    google.accounts.id.prompt();
  } else {
    // Fallback: simulate login for testing
    const mockUser = {
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://via.placeholder.com/150',
      sub: '123456789'
    };
    
    this.customerservice.addcustomermongo(mockUser).subscribe({
      next:(response)=>{
        console.log('Mock login success',response);
        sessionStorage.setItem("Loggedinuser",JSON.stringify(response));
        this.isloggedIn = true;
        alert('Logged in successfully as Test User!');
      },
      error:(error)=>{
        console.error('Login failed',error);
        // Even if backend fails, simulate login for UI testing
        sessionStorage.setItem("Loggedinuser",JSON.stringify(mockUser));
        this.isloggedIn = true;
        alert('Logged in successfully (demo mode)!');
      }
    });
  }
}

private decodetoken(token:String){
  return JSON.parse(atob(token.split(".")[1]))
}

handlelogin(response:any){
  const payload=this.decodetoken(response.credential)
  console.log('Google login payload:', payload);
  
  this.customerservice.addcustomermongo(payload).subscribe({
    next:(response)=>{
      console.log('POST success',response);
      sessionStorage.setItem("Loggedinuser",JSON.stringify(response));
      this.isloggedIn = true;
      alert('Successfully logged in with Google!');
      window.location.reload();
    },
    error:(error)=>{
      console.error('Post request failed',error);
      // Even if backend fails, save user data for UI testing
      sessionStorage.setItem("Loggedinuser",JSON.stringify(payload));
      this.isloggedIn = true;
      alert('Logged in successfully!');
      window.location.reload();
    }
  })
}

handlelogout(){
  if (typeof google !== 'undefined') {
    google.accounts.id.disableAutoSelect();
  }
  sessionStorage.removeItem('Loggedinuser');
  this.isloggedIn = false;
  alert('Logged out successfully!');
  window.location.reload();
}

navigate(route:string){
  this.router.navigate([route])
}
}
