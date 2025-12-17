import { BrowserRouter } from "react-router-dom";
import { Header, MatchResults, MatchResultsDonutChart } from "./components";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col pb-12">
        <Header />
        <div className="px-8">
          <MatchResults />
          <MatchResultsDonutChart />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
