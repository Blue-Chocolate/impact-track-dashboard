import reportsData from "../reports.json";

export type Report = {
  id: number;
  title: string;
  date: string;
  summary: string;
};

let reports: Report[] = reportsData;

export async function fetchReports(): Promise<Report[]> {
  return Promise.resolve(reports);
}
