"use client"

import Dashboard from "./dashboard"
import Registration from "./registration"
import Database from "./database"
import Tracking from "./tracking"
import Admin from "./admin"
import Login from "./login"
import Landing from "./landing"

import { ThemeProvider } from "@/components/theme-provider"
import { useLocation, useNavigate } from "react-router-dom"
import PropertyView from "./property-view"
import PropertyEdit from "./property-edit"
import { useEffect, useState } from "react"
import Map from "./map"
import axios from "axios"
import { hasPermissions,canRegisterProperty} from "@/lib/permissions"
import { Role } from "@/types"
export default function GovPropertyPortal() {
  const [role,setRole]=useState("")
  const [userRole, setUserRole] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<Role[]>([])
  const location = useLocation()
  const navigate = useNavigate()
  const isLoginPage = location.pathname === "/admin/securelogin/login/"
  const isLandingPage = location.pathname === "/"
   const isMap = location.pathname === "/map"
   useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const users = localStorage.getItem("userData")
        if (!users) {
          console.error("No user data found")
          return
        }
        const userData = JSON.parse(users)
        if (!userData.role) {
          console.error("No role found in user data")
          return
        }
        setUserRole(userData.role)
        
        await axios.get("https://bdicisp.onrender.com/api/v1/roles", {
          headers: {
            "x-access-token": ` ${localStorage.getItem("authToken")}`,
          }
        }).then(res => {
          if (Array.isArray(res.data)) {
            setPermissions(res.data)
          } else {
            console.error("Roles data is not an array:", res.data)
          }
        })
      } catch (error) {
        console.error("Failed to fetch user role:", error)
      }
    }
    fetchUserRole()
  }, [])
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    let user = userData ? JSON.parse(userData) : null;
    //let user = JSON.parse(localStorage.getItem('userData'));
    console.log(user); // Check if it's an object
    console.log(user?.role); // Check if role exists
    setRole(user?.role)

  }, [])

  if (isLoginPage) {
    return (
      <ThemeProvider>
        <Login />
      </ThemeProvider>
    )
  }
  if (isMap) {
    return (
      <ThemeProvider>
        <Map />
      </ThemeProvider>
    )
  }

  if (isLandingPage) {
    return (
      <ThemeProvider>
        <Landing />
      </ThemeProvider>
    )
  }
 
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-primary text-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img style={{width:50,height:50}} src="https://ik.imagekit.io/bdic/benue-government-properties/Images/benue-state-logo.png?updatedAt=1745964333054" />
              <div>
                <h1 className="text-xl font-bold">Benue State Government Integrated Properties and Assets Management Portal</h1>
                {/* <p className="text-xs text-white text-primary-foreground/80">Federal Republic of Nigeria</p> */}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <span className="text-sm text-primary-foreground/80">Welcome, {role}</span>
              </div>
              <button
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 px-3 py-1 rounded text-sm"
                onClick={() => navigate("/")}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="bg-primary-foreground/10">
            <div className="container mx-auto px-4">
              <ul className="flex overflow-x-auto">
                {[
                  { name: "Dashboard", path: "/dashboard" },
                  { name: "Registration", path: "/registration" },
                  { name: "Database", path: "/database" },
                  { name: "Tracking", path: "/tracking" },
                  { name: "Admin", path: "/admin" }
                ]
                .map((tab) => {
                  
                  const canViewReg =
                  tab.name === "Registration"
                    ? hasPermissions(userRole ||"", "Property Registration", permissions)
                    : true; // default allow others

                  const canViewAdmin =
                  tab.name === "Admin"
                    ? hasPermissions(userRole ||"", "Role Management", permissions)
                    : true; 
          
                if (!canViewReg) return null;
                if (!canViewAdmin) return null;
                return (
                  <li key={tab.name} className="flex-shrink-0">
                   {
                  
                      <button
                    onClick={() => navigate(tab.path)}
                    className={`px-4 py-3 text-sm font-medium text-white transition-colors ${
                      location.pathname === tab.path
                        ? "border-b-2 text-white border-yellow-400 text-white"
                        : "text-primary-foreground/80 hover:text-white"
                    }`}
                  >
                    {tab.name}
                  </button>
                   }
                  
                  </li>
                )
                    
})}
              </ul>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          {location.pathname === "/dashboard" && <Dashboard />}
          {
            canRegisterProperty(userRole||"","Property Registration",permissions) && location.pathname === "/registration" &&  <Registration  />
          }
          {location.pathname === "/database" && <Database />}
          { location.pathname === "/tracking" && <Tracking />}
          {location.pathname === "/admin" && <Admin />}
          {location.pathname.startsWith("/property/") && <PropertyView />}
          {location.pathname.startsWith("/edit/property/") && <PropertyEdit />}
        </main>

        {/* Footer */}
        <footer className="bg-primary text-white py-4 mt-auto">
          <div className="container mx-auto px-4 text-center text-sm">
            <p>© {new Date().getFullYear()} Benue State Integrated Properties and Assets Management Portal. All rights reserved.</p>
            <p className="text-primary-foreground/80 text-xs mt-1">
            Powered by BDIC
            {/* <img style={{height:50,width:50}} src="https://bdic.ng/wp-content/uploads/2024/11/logo.png" /> */}
             </p>
           
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
} 