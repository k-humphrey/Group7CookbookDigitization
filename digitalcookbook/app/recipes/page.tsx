import Filters from "../components/filters";
export default function RecipeSearchPage() {
  return (
    <div>
      {/* Background Image */}
      <div 
        className="w-full bg-cover bg-center bg-no-repeat pt-15 pb-5 flex flex-col items-center"  
        style={{
        backgroundSize: "110%", 
        backgroundImage: "url('/searchbackground.jpg')"
        }}
      >
        {/* Search Bar */}
        <div className="w-full max-w-3xl flex justify-between">
          <label className="input input-bordered rounded-full w-full flex items-center gap-3 h-12 px-6 bg-[#DEE4D6]">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 opacity-70"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="16.65" y1="16.65" x2="21" y2="21" />
                </svg>
                
                <input type="text" className="grow placeholder:text-slate-950" placeholder="Search recipes or ingredients..." />
            </label>
        </div>
      </div>

      {/* Ingredients Box */}
      <div>
        <div 
        className="w-full bg-gray-200 py-5 px-10 flex justify-between items-start">
          <div className="flex flex-wrap gap-2 flex-1 justify-center">
            tags go here
          </div>

          {/* Clear Tags Button */}
          <button className="btn btn-sm md:btn-md lg:btn-lg shrink-0">
            Search Recipes
          </button>
          
        </div>
      </div>

      {/* Filters */}
      <Filters />
    </div>
  );
}