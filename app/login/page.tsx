import { LoginForm } from '@/app/components/ui/loginForm'

export default function LoginPage() {
  return (
      <div className="relative h-dvh w-full flex items-center justify-center bg-[#EEEEEE]">
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", 
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            backgroundColor: "rgba(248, 125, 66, 0.8)",
            filter: "blur(40px)",
            boxShadow: "0 0 60px 30px rgba(248, 125, 66, 0.7)",
            zIndex: 0,
            pointerEvents: "none", 
          }}>
        </div> 
        <div className="min-h-screen flex items-center justify-center bg-[#EEEEEE]">
          <LoginForm/>
        </div>
      </div>
     
  );
}
