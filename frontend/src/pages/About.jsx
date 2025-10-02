import { useEffect, useState } from "react";
import { FourSquare } from "react-loading-indicators";
import Modal from "../components/Modal";
import "./About.css";

const LOGO_SVG =
  "https://upload.wikimedia.org/wikipedia/en/c/ca/Studio_Ghibli_logo.svg";


const BG_VIDEO = "/ghibli.mp4";

export default function About() {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState(LOGO_SVG);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <FourSquare color="#5A4E9D" size={40} />
      </div>
    );
  }

  return (
    <div className="about-page">
      {/* Background video */}
      <video autoPlay loop muted playsInline className="about-video">
        <source src={BG_VIDEO} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="about-overlay"></div>

      <div className="about-container">
        <h1>About Studio Ghibli Film Catalog</h1>

        <div className="about-card">
          <div className="about-image">
            <img
              src={logoSrc}
              alt="Studio Ghibli"
              onClick={() => setIsModalOpen(true)}
              onError={() => setLogoSrc("/logo.png")} // fallback to local file
              style={{ cursor: "pointer" }}
            />
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <img
              src={logoSrc}
              alt="Studio Ghibli"
              style={{ width: "100%", height: "auto" }}
              onError={() => setLogoSrc("/logo.png")}
            />
          </Modal>

          <div className="about-text">
            <p>
              This catalog showcases Studio Ghibli films with details such as
              director, producer, release date, and Rotten Tomatoes score. It is
              built with React and Express.js, fetching data from the Studio
              Ghibli API via a backend proxy.
            </p>
            <p>
              Users can search by title, filter by director, and sort films by
              release year or score. The application supports light/dark themes
              and responsive layouts.
            </p>
          </div>
        </div>

        <div className="about-history">
          <h2>Studio Ghibli History</h2>
          <p>
            Founded in 1985 by Hayao Miyazaki and Isao Takahata, Studio Ghibli
            has produced some of the world's most beloved animated films. Their
            works include classics like "My Neighbor Totoro", "Spirited Away",
            and "Princess Mononoke".
          </p>
        </div>

        <div className="about-funfacts">
          <h2>Fun Facts</h2>
          <ul>
            <li>The Cat Bus in "My Neighbor Totoro" was inspired by a real cat.</li>
            <li>Studio Ghibli films have won numerous international awards.</li>
            <li>
              Hayao Miyazaki has come out of retirement multiple times to make
              new films.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
