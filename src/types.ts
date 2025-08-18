export interface HousingDto {
  state: string;
  region: string;
  region_stats: {
    region_rank: number;
    avg_income: number;
    median_housing_cost: number;
    data_count: number;
    burden_distribution: {
      less_than_30_percent: number;
      between_30_and_50_percent: number;
      greater_than_50_percent: number;
    };
  };
  metro_stats: {
    metro_code: number;
    metro_label: string;
    avg_income: number;
    median_housing_cost: number;
    data_count: number;
    burden_distribution: {
      less_than_30_percent: number;
      between_30_and_50_percent: number;
      greater_than_50_percent: number;
    };
  };
}