//../app/emergency-numbers/page.tsx
"use client";
import { useLang } from "@/app/components/languageprovider";

const STRINGS = {
  en: {
    emergencyNumbers: "Emergency Numbers",
    call911: "Call 911 for Emergencies Only",
    nonEmergency: "Police (Non-Emergency)",
    fireRoutine: "Fire (Routine)",
    cityHall: "City Hall / Admin",
    publicWorks: "Public Works",
    sheriffsOffice: "Sheriff's Office",
    poison: "Poison Control:",
    crimeStoppers: "Crime Stoppers (Cookeville):",
    gasLeaks: "Gas Leaks (Cookeville):",
    waterSewer: "Water / Sewer Issues (Cookeville):",
    serviceSupport: "Service / Support Area",
    phoneNumber: "Phone Number",
    availability: "Availability",
    suicideCrisis: "Suicide & Crisis Lifeline",
    poisonControlCenter: "Poison Control Center",
    domesticViolence: "Domestic Violence Hotline",
    humanTrafficking: "National Human Trafficking Hotline",
    veteransCrisis: "Veterans Crisis Line",
    substanceAbuse: "Substance Abuse (SAMHSA Helpline)",
    childhelp: "Childhelp National Abuse Hotline",
    elderAbuse: "Elder Abuse Hotline",
    runawaySafeline: "Runaway Safeline / Youth Crisis Line",
    avail247CallText: "24/7 call or text",
    avail247FreeConf: "24/7 free & confidential",
    avail247AnonHelp: "24/7 anonymous help",
    availTextHelp: 'Text "HELP" to 233733',
    availVetsFamilies: "24/7 for Veterans & families",
    availConfSupport: "24/7 confidential support",
    availChildrenAdults: "Support for children and adults",
    availReferralsGuidance: "Referrals & guidance",
    avail247Teens: "24/7 for teens",
  },
  es: {
    emergencyNumbers: "Números de Emergencia",
    call911: "Llame al 911 solo para emergencias",
    nonEmergency: "Policía (No Emergencia)",
    fireRoutine: "Bomberos (Rutina)",
    cityHall: "Ayuntamiento / Administración",
    publicWorks: "Obras Públicas",
    sheriffsOffice: "Oficina del Sheriff",
    poison: "Control de Envenenamientos:",
    crimeStoppers: "Crime Stoppers (Cookeville):",
    gasLeaks: "Fugas de Gas (Cookeville):",
    waterSewer: "Problemas de Agua / Alcantarillado (Cookeville):",
    serviceSupport: "Área de Servicio / Apoyo",
    phoneNumber: "Número de Teléfono",
    availability: "Disponibilidad",
    suicideCrisis: "Línea de Prevención del Suicidio y Crisis",
    poisonControlCenter: "Centro de Control de Envenenamientos",
    domesticViolence: "Línea de Ayuda contra la Violencia Doméstica",
    humanTrafficking: "Línea Nacional contra la Trata de Personas",
    veteransCrisis: "Línea de Crisis para Veteranos",
    substanceAbuse: "Abuso de Sustancias (Línea SAMHSA)",
    childhelp: "Línea Nacional Childhelp contra el Abuso",
    elderAbuse: "Línea de Ayuda por Abuso a Personas Mayores",
    runawaySafeline: "Línea para Jóvenes en Crisis / Fuga",
    avail247CallText: "24/7 llamada o texto",
    avail247FreeConf: "24/7 gratis y confidencial",
    avail247AnonHelp: "24/7 ayuda anónima",
    availTextHelp: 'Envíe "HELP" al 233733',
    availVetsFamilies: "24/7 para veteranos y familias",
    availConfSupport: "24/7 apoyo confidencial",
    availChildrenAdults: "Apoyo para niños y adultos",
    availReferralsGuidance: "Referencias y orientación",
    avail247Teens: "24/7 para adolescentes",
  },
};

export default function EmergencyNumbersPage() {
  const langContext = useLang();
  const lang = langContext?.lang ?? 'en';
  const t = STRINGS[lang];
  return (
    <main className="min-h-screen p-8 flex flex-col items-center gap-10">
      
      {/* Title */}
      <div className="badge bg-red-800 text-white text-4x1 font-extrabold px-20 py-6 rounded-full">
        {t.emergencyNumbers}
      </div>

      {/* City Services Table */}
      <div className="overflow-x-auto w-full max-w-5xl">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>{t.call911}</th>
              <th>Cookeville</th>
              <th>Algood</th>
              <th>Baxter</th>
              <th>Monterey</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>{t.nonEmergency}</th>
              <td>(931) 526-2125</td>
              <td>(931) 537-6830</td>
              <td>(931) 858-4111</td>
              <td>(931) 839-3770</td>
            </tr>
            <tr>
              <th>{t.fireRoutine}</th>
              <td>(931) 520-5255</td>
              <td>(931) 537-6357</td>
              <td>(931) 858-2621</td>
              <td>(931) 839-2323</td>
            </tr>
            <tr>
              <th>{t.cityHall}</th>
              <td>(931) 526-9591</td>
              <td>(931) 537-9545</td>
              <td>(931) 858-4111</td>
              <td>(931) 839-3770</td>
            </tr>
            <tr>
              <th>{t.publicWorks}</th>
              <td>(931) 537-9545</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <th>{t.sheriffsOffice}</th>
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
        <div className="card border p-4 mx-auto max-w-md text-center">
          <ul className="space-y-3">
            <li>
              <strong>{t.poison}</strong> 1-800-222-1222
            </li>
            <li>
              <strong>{t.crimeStoppers}</strong> (931) 520-7867
            </li>
            <li>
              <strong>{t.gasLeaks}</strong> (931) 520-4427 or (931) 526-9591
            </li>
            <li>
              <strong>{t.waterSewer}</strong> (931) 520-5227 or (931) 528-5533
            </li>
          </ul>
        </div>
      </div>

      {/* National Hotlines */}
      <div className="overflow-x-auto w-full max-w-5xl">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>{t.serviceSupport}</th>
              <th>{t.phoneNumber}</th>
              <th>{t.availability}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>{t.suicideCrisis}</th>
              <td>📞 988</td>
              <td>{t.avail247CallText}</td>
            </tr>
            <tr>
              <th>{t.poisonControlCenter}</th>
              <td>1-800-222-1222</td>
              <td>{t.avail247FreeConf}</td>
            </tr>
            <tr>
              <th>{t.domesticViolence}</th>
              <td>1-800-799-SAFE (7233)</td>
              <td>{t.avail247AnonHelp}</td>
            </tr>
            <tr>
              <th>{t.humanTrafficking}</th>
              <td>1-888-373-7888</td>
              <td>{t.availTextHelp}</td>
            </tr>
            <tr>
              <th>{t.veteransCrisis}</th>
              <td>988, press 1</td>
              <td>{t.availVetsFamilies}</td>
            </tr>
            <tr>
              <th>{t.substanceAbuse}</th>
              <td>1-800-662-HELP (4357)</td>
              <td>{t.availConfSupport}</td>
            </tr>
            <tr>
              <th>{t.childhelp}</th>
              <td>1-800-4-A-CHILD (422-4453)</td>
              <td>{t.availChildrenAdults}</td>
            </tr>
            <tr>
              <th>{t.elderAbuse}</th>
              <td>1-800-677-1116</td>
              <td>{t.availReferralsGuidance}</td>
            </tr>
            <tr>
              <th>{t.runawaySafeline}</th>
              <td>1-800-RUNAWAY (786-2929)</td>
              <td>{t.avail247Teens}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}