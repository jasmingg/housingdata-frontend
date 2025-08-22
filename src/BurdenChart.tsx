import './BurdenChart.css'
import { stateToAbbr } from "./lib/stateToAbbr";

type BurdenDistribution = {
  less_than_30_percent: number;
  between_30_and_50_percent: number;
  greater_than_50_percent: number;
};

type BurdenChartProps = {
  state: string;
  metro: string;
  regionBurdenData: BurdenDistribution;
  metroBurdenData: BurdenDistribution;
};

export default function BurdenChart({ state, metro, regionBurdenData, metroBurdenData }: BurdenChartProps) {
  const stateAbbr = stateToAbbr[state.toLowerCase()];
  const chartUrl = `https://housingdata-charts.s3.us-east-1.amazonaws.com/charts/housing_burden_${stateAbbr}_metro${metro}_latest.svg`;

  const toTitleCase = (str: string) =>
    str.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  const getMetroLabel = (metro: string) => {
    if (metro === "1") return "City households";
    else if (metro === "3") return "Suburban households";
    else if (metro === "5") return "Rural/Small town households";
    else return "Unknown";
  };

  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

  const getBurdenLabel = (burden: BurdenDistribution, label: string, type: string) => {
    const over30 = burden.between_30_and_50_percent + burden.greater_than_50_percent;
    return <div className={`burden-box ${getColor(type == "region" ? regionBurdenData : metroBurdenData)}`}>
            Back in 2013, over <span className='highlight'>{formatPercent(over30)} percent</span> of {label} {type === "region" ? "was" : "were"} burdened by housing costs.
            </div>
  };

  const getColor = (burden: BurdenDistribution) => {
    const over30 = burden.between_30_and_50_percent + burden.greater_than_50_percent;
    if (over30 < 0.2) return "green";
    else if (over30 < 0.3) return "yellow";
    else return "red";
  };

  const regionLabel = getBurdenLabel(regionBurdenData, toTitleCase(state), "region");
  const metroLabel = getBurdenLabel(metroBurdenData, `${getMetroLabel(metro)} in ${toTitleCase(state)}`, "metro");

  return (
    <div className="burden-chart-wrapper">
      <div className="chart-section">
        <div className="chart-info-box">
          <h2>Defining Housing Burden Distribution</h2>
          <p>
            This chart shows what portion of households in {toTitleCase(state)} spend
            <strong> less than 30%</strong>, <strong>30–50%</strong>, or
            <strong> over 50%</strong> of their income on housing. Spending over 30% is generally considered “burdened”.
          </p>
        </div>

        <div className="chart-img-box">
          <img src={chartUrl} alt="Housing burden distribution pie charts" loading="lazy" />
          <div className="button-group">
            <button onClick={() => window.open(chartUrl, '_blank', 'noopener,noreferrer')}>View Chart</button>
            <button onClick={() => window.open('https://jasmingg.github.io/housingdata-visualizer/', '_blank', 'noopener,noreferrer')}>Charts Indexer</button>
          </div>
        </div>
      </div>

      <div className="burden-boxes">
        {regionLabel}
        {metroLabel}
      </div>
    </div>
  );
}