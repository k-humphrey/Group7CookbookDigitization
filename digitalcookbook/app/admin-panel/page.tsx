//app/admin-panel/page.tsx
//Page for admin to view, edit, add, and delete recipes once logged in via the admin portal  

import { cookies } from "next/headers";
import { isAdminAuthenticated } from "@/lib/checkAdminAuth";
import AdminLoginPage from "../admin-login/page";
import AdminNavBar from "../components/adminNavBar";

export default async function AdminPanelPage() {
	//get cookies
	const cookieStore = await cookies(); 

	//check authentication
	if (!isAdminAuthenticated(cookieStore)) {
			//return login page back
			return <AdminLoginPage />
	}

	return(
		<div>
		<h2>Welcome Admin!</h2>
			<AdminNavBar/>
		</div>
	)
}