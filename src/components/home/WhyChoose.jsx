import {
  FaGlobe,
  FaLock,
  FaBolt,
  FaChartLine,
} from "react-icons/fa";

export default function WhyChoose() {
  const features = [
    {
      icon: <FaGlobe />,
      title: "Global Coverage",
      desc: "Send and receive money across 170+ countries with real-time currency conversion.",
    },
    {
      icon: <FaLock />,
      title: "Secure & Encrypted",
      desc: "Bank-grade security, encrypted transactions, and regulatory compliance worldwide.",
    },
    {
      icon: <FaBolt />,
      title: "Fast Transfers",
      desc: "Instant or same-day transfers with transparent fees and no hidden charges.",
    },
    {
      icon: <FaChartLine />,
      title: "Live Exchange Rates",
      desc: "Mid-market rates with real-time tracking and smart rate alerts.",
    },
  ];

  return (
    <section className="section why-section">
      <div className="container">
        <h2 className="why-title">Why Choose MoneyGram?</h2>

        <div className="why-grid">
          {features.map((item, index) => (
            <div key={index} className="why-card">
              <div className="why-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
