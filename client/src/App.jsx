import "./App.css";
import Footer from "./components/Footer";
import HeaderNav from "./components/HeaderNav";


function App() {
  return (
    <div>
      <HeaderNav />
      <main className="landing-page">
        <section className="hero-card" aria-labelledby="page-title">
          <p className="eyebrow">MediaVault</p>
          <h1 id="page-title">Hello World</h1>
          <p className="intro">
            Welcome to MediaVault, a simple place to organize and manage your
            media collection.
          </p>
        </section>
      </main>
      <Footer/>
    </div>
  );
}

export default App;
