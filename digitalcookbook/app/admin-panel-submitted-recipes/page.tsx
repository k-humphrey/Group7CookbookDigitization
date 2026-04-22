import { connectToDB } from "@/lib/connectToDB";
import { cookies } from "next/headers";
import { isAdminAuthenticated } from "@/lib/checkAdminAuth";
import AdminLoginPage from "../admin-login/page";
import Link from "next/link";
import SubmittedRecipeSelector from "../components/submittedRecipeSelector";

export default async function AdminPanelPage() {
    const cookieStore = await cookies();

    if (!(await isAdminAuthenticated(cookieStore))) {
        return <AdminLoginPage />;
    }

    await connectToDB();

    return (
        <section className="min-h-screen w-full flex flex-col items-center py-12">
            <h1 className="text-2xl font-bold mb-6 ml-6">Admin Panel</h1>
            <div className="flex justify-center mx-2">
                <Link href="/admin-panel" className="block px-4 py-2 hover:bg-gray-100">Edit Recipes</Link>
                <Link href="/admin-panel-featured" className="block px-4 py-2 hover:bg-gray-100">Edit Featured Recipes</Link>
                <Link href="/admin-panel-sponsors" className="block px-4 py-2 hover:bg-gray-100">Edit Sponsors</Link>
                <Link href="/admin-panel-resources" className="block px-4 py-2 hover:bg-gray-100">Edit Resources</Link>
                <Link href="/admin-panel-partners" className="block px-4 py-2 hover:bg-gray-100">Edit Partners</Link>
                <Link href="/admin-panel-ingredients" className="block px-4 py-2 hover:bg-gray-100">Edit Ingredients</Link>
                <Link href="/admin-panel-submitted-recipes" className="block px-4 py-2 hover:bg-gray-100">Submitted Recipes</Link>
            </div>

            <div className="w-full max-w-6xl mx-auto">
                <SubmittedRecipeSelector />
            </div>
        </section>
    );
}