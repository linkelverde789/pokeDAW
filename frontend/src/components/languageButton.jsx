import { useTranslation } from "react-i18next";

function LanguageButton() {
    const {i18n} = useTranslation();
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: '#2C3E50',
      padding: '5px 15px',
      borderRadius: '25px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      position: 'relative',
      width: '120px',
      height: '40px',
      justifyContent: 'space-between',
    }}>
      <span style={{ color: 'white', fontSize: '14px', zIndex: 1 }}>ES</span>
      <button
        onClick={() => {
          i18n.changeLanguage(i18n.language === "es" ? "en" : "es");
        }}
        className="pokemon-button"
        style={{
          background: 'linear-gradient(to bottom, #FF0000 50%, #FFFFFF 50%)',
          border: '3px solid #000000',
          borderRadius: '50%',
          width: '35px',
          height: '35px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          position: 'absolute',
          left: i18n.language === "es" ? '5px' : '75px',
          zIndex: 2
        }}
      >
        <div style={{
          width: '15px',
          height: '15px',
          background: '#FFFFFF',
          border: '2px solid #000000',
          borderRadius: '50%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }} />
      </button>
      <span style={{ color: 'white', fontSize: '14px', zIndex: 1 }}>EN</span>
    </div>
  );
}

export default LanguageButton