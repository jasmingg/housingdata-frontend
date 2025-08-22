type BurdenChartProps = {
  state: string;
  metro: string;
}

import { stateToAbbr } from "./lib/stateToAbbr";

export default function BurdenChart ({state, metro}: BurdenChartProps) {
let stateAbbr = stateToAbbr[state]
const chartUrl = `https://jasmingg.github.io/housingdata-visualizer/charts/housing_burden_${stateAbbr}_metro${metro}_latest.svg`;
function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

return (
<div className="chart-section">
  <div className="chart-info-box">
    <h2>Defining Housing Burden Distribution</h2>
    <p>
      This chart shows what portion of households in {toTitleCase(state)} spend
      <strong> less than 30%</strong>, <strong>30–50%</strong>, or
      <strong> over 50%</strong> of their income on housing. Spending over 30%
      is generally considered “burdened”.
    </p>
  </div>

  <div className="chart-img">
    <img src={chartUrl} alt="Housing burden distribution pie charts" />
  </div>
</div>
);

}