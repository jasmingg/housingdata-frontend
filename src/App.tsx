import { useState } from "react";
import type { HousingDto } from "./types";
import "./App.css";
import {fetchHousing, buildHousingUrl} from "./lib/api"
import BurdenChart from './BurdenChart'

export default function App() {
  const [stateParam, setStateParam] = useState<string>("");
  const [metroParam, setMetroParam] = useState<string>("");
  const [data, setData] = useState<HousingDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [curl, setCurl] = useState("");

  const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","District Of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois",
  "Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts",
  "Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
  "New Hampshire","New Jersey","New Mexico","New York","North Carolina",
  "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
  "South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia",
  "Washington","West Virginia","Wisconsin","Wyoming"
];

  async function onFetch() {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const s = titleCase(stateParam);
      const m = metroParam.trim();
      if (!US_STATES.includes(s)) {
      setError('Please enter a valid U.S. state (e.g., "Virginia").');
      return;
      }
      if (!m) {
        setError("Please pick a metro category.");
        return;
      }
      const d = await fetchHousing(s, m);
      setData(d);
      setCurl(`curl "${buildHousingUrl(s, m)}"`);
    } catch (e: any) {
    // Network errors in fetch are TypeError
    if (e?.name === "TypeError") {
      setError("Network error. API is not reachable.");
    } else if (e?.status) {
      const s = e.status as number;
      if (s === 400 || s === 422) setError("Invalid request. Check the state and metro values.");
      else if (s === 404) setError("No data found for that state/metro.");
      else if (s >= 500) setError(`Server error (${s}). Try again later.`);
      else setError(`Request failed (${s}).`);
    } else {
      setError("Unexpected error.");
    }
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="app">
<h1>Housing Data Visualizer</h1>

<div className="hero">
  <p className="lead">
    Explore my live API for housing metrics using the <b>2013 American Housing Survey (AHS)</b> published by
    the <b>U.S. Census Bureau</b>. 
  </p>
  <p className="source">
    Data source: 2013 <abbr title="American Housing Survey">AHS</abbr> (HUD / U.S. Census Bureau).
    Values are a snapshot from that survey year.
  </p>
  {/* optional: mini details panel */}
  <details className="details">
    <summary>About the data</summary>
    <ul style={{ margin: "8px 0 0 16px" }}>
      <li>Collected by the U.S. Census Bureau for HUD’s American Housing Survey (2013).</li>
      <li>“Metro” follows federal MSA rules; “Non-metro” includes micropolitan & rural areas.</li>
      <li>Figures are pre-computed aggregates for quick demo queries.</li>
    </ul>
  </details>
</div>

      <div className="grid">
        <label>
          <div className="label">State</div>
          <input className="input" value={stateParam} onChange={(e) => setStateParam(e.target.value)} />
        </label>
        <label>
          <div className="label-row">
            <div className="label">Metro</div>
            <InfoTooltip />
          </div>

          <div className="select-wrap">
            <select
              className="input"
              value={metroParam}
              onChange={(e) => setMetroParam(e.target.value)}
            >
              <option value="" disabled>
                Select: Central, Suburban, or Non-metro
              </option>
              <option value="1">Central City</option>
              <option value="3">Suburban</option>
              <option value="5">Non-metro (rural / small towns)</option>
            </select>
          </div>
        </label>

        <button onClick={onFetch} disabled={loading || !stateParam || !metroParam}>
          {loading ? "Fetching…" : "Fetch"} {/*TODO: replace truthy "fetching" value w/ function for loading animation*/}
        </button>
      </div>
      {/* cURL snippet for CI/CL usage*/}
      {curl && (
        <div className="grid" style={{ gridTemplateColumns: "1fr auto" }}>
          <input className="input" value={curl} readOnly />
          <button onClick={() => navigator.clipboard.writeText(curl)}>Copy command</button>
        </div>
      )}

      {error && (
        <div className="alert">
          Something went wrong: {error}.
        </div>
      )}

      {data && (
        <div className="section">
          <div className="cards">
            <Card title="State" value={data.state} subtitle={`Region: ${data.region}`} />
            <Card title="Region Rank (based on average income)" value={String('#' + data.region_stats.region_rank)} subtitle="of the 4 major regions*" />
            <Card title="Metro" value={data.metro_stats.metro_label} subtitle={`Code: ${data.metro_stats.metro_code}`} />
          </div>

          <div className="cards">
            <Card title="Region Average Income" value={fmtCurrency(data.region_stats.avg_income)} />
            <Card title="Metro Average Income" value={fmtCurrency(data.metro_stats.avg_income)} />
            <Card title="Region Average Housing Cost" value={fmtCurrency(data.region_stats.median_housing_cost)} subtitle="per month" />
            <Card title="Metro Average Housing Cost" value={fmtCurrency(data.metro_stats.median_housing_cost)} subtitle="per month"/>
          </div>
          <BurdenChart
            state={data.state}
            metro={String(data.metro_stats.metro_code)}
            regionBurdenData={data.region_stats.burden_distribution}
            metroBurdenData={data.metro_stats.burden_distribution}
             />

          <details className="details">
            <summary>Click here for the raw JSON</summary>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
}

function Card({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) {
  return (
    <div className="card">
      <div className="eyebrow">{title}</div>
      <div className="value">{value}</div>
      {subtitle && <div className="sub">{subtitle}</div>}
    </div>
  );
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function InfoTooltip() {
  return (
    <span className="tooltip">
      <button className="info-btn" aria-label="How do I know what to choose?">?</button>
      <div className="tooltip-panel" role="tooltip">
        <div><b>Metro</b>: county in a Metropolitan Statistical Area. Anchored by an urban core ≥ 50,000 and nearby counties with strong commuting ties.</div>
        <div><b>Central city</b>: inside the principal city/core.</div>
        <div><b>Suburban</b>: in an MSA, but outside the principal city.</div>
        <div><b>Non-metro</b>: not in an MSA (includes micropolitan + rural).</div>
      </div>
    </span>
  );
}

// normalizing the state input from user
function titleCase(s: string) {
  return s.trim().toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase());
}