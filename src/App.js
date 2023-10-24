import "./App.css";
import ImageMatching from "./components/CrossCorrelation/ImageMatching";

import ImageUploader from "./components/ImageUploader/ImageUploader.jsx";

function App() {
  return (
    <div className="App">
      <ImageUploader />
      {/* <ImageMatching /> */}
    </div>
  );
}

export default App;
