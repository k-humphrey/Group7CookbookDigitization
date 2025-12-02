//app/communityresources/page.tsx
import Navbar from "../components/navbar";


export default function CommResourcesPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start">
      {/* Nav bar */}
        <Navbar/>

      {/* Background picture */}
      <div 
        className="w-full bg-cover bg-center bg-repeat py-30 flex flex-col items-center"  
        style={{
          backgroundSize: "110%", 
          backgroundImage: "url('/searchbackground.jpg')"
          }}/>  
      <div>
        <h1>Community Resources</h1>
        <p>This is the community resource page.</p></div>
      <div/>
        {/* Footer */}
        {/* <Footer /> */}
    </main>
  );
}