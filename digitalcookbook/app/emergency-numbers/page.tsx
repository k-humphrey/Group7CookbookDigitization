//../app/emergency-numbers/page.tsx
"use client";
import { useLang } from "@/app/components/languageprovider";
import { EMERGENCY_STRINGS } from "@/app/emergency-numbers/emergencyStrings";
 
export default function EmergencyNumbersPage() {
  const langContext = useLang();
  const lang = langContext?.lang ?? 'en';
  const t = EMERGENCY_STRINGS[lang];
  return (
    <section className="min-h-screen p-8 flex flex-col items-center gap-10">
      
      {/* Title */}
      <h1 className="badge bg-red-800 text-white text-4xl font-extrabold px-20 py-7 rounded-full">
        {t.emergencyNumbers}
      </h1>

      {/* City Services Table */}
      <div className="overflow-x-auto w-full max-w-5xl">
        <table className="table table-bordered p-5">
          <caption className="sr-only">
            {t.localEmergencyNumbers}
          </caption>
          <thead>
            <tr>
              <th scope="col">{t.call911}</th>
              <th scope="col">Cookeville</th>
              <th scope="col">Algood</th>
              <th scope="col">Baxter</th>
              <th scope="col">Monterey</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <th scope="row">{t.nonEmergency}</th>
                <td>(931) 526-2125</td>
                <td>(931) 537-6830</td>
                <td>(931) 858-4111</td>
                <td>(931) 839-3770</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <th scope="row">{t.fireRoutine}</th>
                <td>(931) 520-5255</td>
                <td>(931) 537-6357</td>
                <td>(931) 858-2621</td>
                <td>(931) 839-2323</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <th scope="row">{t.cityHall}</th>
                <td>(931) 526-9591</td>
                <td>(931) 537-9545</td>
                <td>(931) 858-4111</td>
                <td>(931) 839-3770</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <th scope="row">{t.publicWorks}</th>
                <td>(931) 537-9545</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <th scope="row">{t.sheriffsOffice}</th>
                <td>(931) 528-8484</td>
                <td>(931) 528-8484</td>
                <td>(931) 528-8484</td>
                <td>(931) 839-8200
                  (Sub-station)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* One-column section */}
      <div className="grid grid-cols-1 gap-8 w-full max-w-5xl">
        
        {/* Personal Contacts */}
        {/*
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
        </div>   */}

        {/* Utilities & Help */}
        <section className="card border p-4 mx-auto max-w-md text-center">
          <h2 className="sr-only">{t.utilitiesAndHelp}</h2>
          <ul className="space-y-3">
            <li className="hover:bg-gray-50">
              <strong>{t.poison}</strong> 1-800-222-1222
            </li>
            <li className="hover:bg-gray-50">
              <strong>{t.crimeStoppers}</strong> (931) 520-7867
            </li>
            <li className="hover:bg-gray-50">
              <strong>{t.gasLeaks}</strong> (931) 520-4427 or (931) 526-9591
            </li>
            <li className="hover:bg-gray-50">
              <strong>{t.waterSewer}</strong> (931) 520-5227 or (931) 528-5533
            </li>
          </ul>
        </section>
      </div>

      {/* National Hotlines */}
      <div className="overflow-x-auto w-full max-w-5xl">
        <table className="table table-bordered p-5">
          <caption className="sr-only">
            {t.nationalSupportHotlines}
          </caption>
          <thead>
            <tr>
              <th scope="col">{t.serviceSupport}</th>
              <th scope="col">{t.phoneNumber}</th>
              <th scope="col">{t.availability}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <th scope="row">{t.suicideCrisis}</th>
                <td>📞 988</td>
                <td>{t.avail247CallText}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <th scope="row">{t.poisonControlCenter}</th>
                <td>1-800-222-1222</td>
                <td>{t.avail247FreeConf}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <th scope="row">{t.domesticViolence}</th>
                <td>1-800-799-SAFE (7233)</td>
                <td>{t.avail247AnonHelp}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <th scope="row">{t.humanTrafficking}</th>
                <td>1-888-373-7888</td>
                <td>{t.availTextHelp}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <th scope="row">{t.veteransCrisis}</th>
                <td>988, press 1</td>
                <td>{t.availVetsFamilies}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <th scope="row">{t.substanceAbuse}</th>
                <td>1-800-662-HELP (4357)</td>
                <td>{t.availConfSupport}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <th scope="row">{t.childhelp}</th>
                <td>1-800-4-A-CHILD (422-4453)</td>
                <td>{t.availChildrenAdults}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <th scope="row">{t.elderAbuse}</th>
                <td>1-800-677-1116</td>
                <td>{t.availReferralsGuidance}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <th scope="row">{t.runawaySafeline}</th>
                <td>1-800-RUNAWAY (786-2929)</td>
                <td>{t.avail247Teens}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}