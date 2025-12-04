import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "+919680896969";

export function WhatsAppButton() {
  const handleClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, "")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
      aria-label="Chat on WhatsApp"
      data-testid="button-whatsapp"
    >
      <FaWhatsapp className="h-7 w-7" />
    </button>
  );
}
