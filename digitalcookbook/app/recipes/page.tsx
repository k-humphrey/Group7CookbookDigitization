import Filters from "../components/filters";
import RecipeGrid from "../components/recipecards";
import Searchbar from "../components/searchbar"
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
       <Searchbar /> 
      </div>
      
      <div className="flex w-full gap-6">

        {/* Filters */}
        <div className="w-64 sticky top-0 self-start shrink-0">
          <Filters />
        </div>
        
        {/* Recipes */}
        <div className="flex-1">
          <RecipeGrid />
        </div>
      </div>
    </div>
  );
}