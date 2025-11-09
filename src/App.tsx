import { Header, MatchResults, MatchResultsDonutChart } from "./components";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col pb-12">
      <Header />
      <div className="px-8">
        <MatchResults />
        <MatchResultsDonutChart />
      </div>
    </div>
  );
};

export default App;
