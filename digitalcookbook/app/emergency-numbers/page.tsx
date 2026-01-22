//../app/emergency-numbers/page.tsx

export default function EmergencyNumbersPage() {
  return (
    <main className="min-h-screen p-8 flex flex-col items-center gap-10">
      
      {/* Title */}
      <div className="badge bg-red-800 text-white text-2x2 px-20 py-6 rounded-full">
        Emergency Numbers
      </div>

      {/* City Services Table */}
      <div className="overflow-x-auto w-full max-w-5xl">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Call 911 for Emergencies Only</th>
              <th>Cookeville</th>
              <th>Algood</th>
              <th>Baxter</th>
              <th>Monterey</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Police (Non-Emergency)</th>
              <td>(931) 526-2125</td>
              <td>(931) 537-6830</td>
              <td>(931) 858-4111</td>
              <td>(931) 839-3770</td>
            </tr>
            <tr>
              <th>Fire (Routine)</th>
              <td>(931) 520-5255</td>
              <td>(931) 537-6357</td>
              <td>(931) 858-2621</td>
              <td>(931) 839-2323</td>
            </tr>
            <tr>
              <th>City Hall / Admin</th>
              <td>(931) 526-9591</td>
              <td>(931) 537-9545</td>
              <td>(931) 858-4111</td>
              <td>(931) 839-3770</td>
            </tr>
            <tr>
              <th>Public Works</th>
              <td>(931) 537-9545</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <th>Sheriff's Office</th>
              <td>(931) 528-8484</td>
              <td>(931) 528-8484</td>
              <td>(931) 528-8484</td>
              <td>(931) 839-8200
                (Sub-station)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        
        {/* Personal Contacts */}
        <div className="card border p-4">
          <h2 className="font-bold mb-2">Personal / Local Contacts</h2>
          <table className="table">
            <tbody>
              <tr><th>Hospital</th><td>931-528-2541</td></tr>
              <tr><th>Family Doctor</th><td></td></tr>
              <tr><th>Veterinarian</th><td></td></tr>
              <tr><th>School / Daycare</th><td></td></tr>
            </tbody>
          </table>
        </div>

        {/* Utilities & Help */}
        <div className="card border p-4">
          <ul className="space-y-3">
            <li>
              <strong>Poison Control:</strong> 1-800-222-1222
            </li>
            <li>
              <strong>Crime Stoppers (Cookeville):</strong> (931) 520-7867
            </li>
            <li>
              <strong>Gas Leaks (Cookeville):</strong> (931) 520-4427 or (931) 526-9591
            </li>
            <li>
              <strong>Water / Sewer Issues (Cookeville):</strong> (931) 520-5227 or (931) 528-5533
            </li>
          </ul>
        </div>
      </div>

      {/* National Hotlines */}
      <div className="overflow-x-auto w-full max-w-5xl">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Service / Support Area</th>
              <th>Phone Number</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Suicide & Crisis Lifeline</th>
              <td>📞 988</td>
              <td>24/7 call or text</td>
            </tr>
            <tr>
              <th>Poison Control Center</th>
              <td>1-800-222-1222</td>
              <td>24/7 free & confidential</td>
            </tr>
            <tr>
              <th>Domestic Violence Hotline</th>
              <td>1-800-799-SAFE (7233)</td>
              <td>24/7 anonymous help</td>
            </tr>
            <tr>
              <th>Nation Human Trafficking Hotline</th>
              <td>1-888-373-7888</td>
              <td>text "HELP" to 233733</td>
            </tr>
            <tr>
              <th>Veterans Crisis Line</th>
              <td>988, press 1</td>
              <td>24/7 for Veterans & families</td>
            </tr>
            <tr>
              <th>Substance Abuse (SAMHSA Helpline)</th>
              <td>1-800-662-HELP (4357)</td>
              <td>24/7 confidential support</td>
            </tr>
            <tr>
              <th>Childhelp National Abuse Hotline</th>
              <td>1-800-4-A-CHILD (422-4453)</td>
              <td>Support for children and adults</td>
            </tr>
            <tr>
              <th>Elder Abuse Hotline</th>
              <td>1-800-677-1116</td>
              <td>Referrals & guidance</td>
            </tr>
            <tr>
              <th>Runaway Safeline / Youth Crisis Line</th>
              <td>1-800-RUNAWAY (786-2929)</td>
              <td>24/7 for teens</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}